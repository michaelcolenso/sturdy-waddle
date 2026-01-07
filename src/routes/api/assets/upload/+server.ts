import { json } from "@sveltejs/kit";
import prisma from "$lib/server/prisma";
import type { AssetKind } from "@prisma/client";
import type { RequestHandler } from "./$types";

type UploadAssetRequest = {
  runId?: string;
  kind?: AssetKind;
  mimeType?: string;
  byteSize?: number;
  sha256?: string;
  storageUrl?: string;
  width?: number | null;
  height?: number | null;
};

const assetKinds: AssetKind[] = ["INPUT", "OUTPUT", "THUMB"];

export const POST: RequestHandler = async ({ request }) => {
  const body = (await request.json()) as UploadAssetRequest;

  if (
    !body.runId ||
    !body.kind ||
    !body.mimeType ||
    body.byteSize === undefined ||
    !body.sha256 ||
    !body.storageUrl
  ) {
    return json(
      { error: "runId, kind, mimeType, byteSize, sha256, and storageUrl are required." },
      { status: 400 }
    );
  }

  if (!assetKinds.includes(body.kind)) {
    return json({ error: "Invalid asset kind." }, { status: 400 });
  }

  const run = await prisma.run.findUnique({
    where: { id: body.runId },
    select: { id: true },
  });

  if (!run) {
    return json({ error: "Run not found." }, { status: 404 });
  }

  const asset = await prisma.asset.create({
    data: {
      runId: body.runId,
      kind: body.kind,
      mimeType: body.mimeType,
      byteSize: body.byteSize,
      sha256: body.sha256,
      storageUrl: body.storageUrl,
      width: body.width ?? null,
      height: body.height ?? null,
    },
  });

  return json(asset, { status: 201 });
};
