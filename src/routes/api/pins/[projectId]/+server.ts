import { json } from "@sveltejs/kit";
import prisma from "$lib/server/prisma";
import type { RequestHandler } from "./$types";

type UpsertPinSetRequest = {
  identityAssetId?: string | null;
  wardrobeNotes?: string | null;
  lightingNotes?: string | null;
};

export const GET: RequestHandler = async ({ params }) => {
  const pinSet = await prisma.pinSet.findUnique({
    where: { projectId: params.projectId },
  });

  if (!pinSet) {
    return json({ error: "Pin set not found." }, { status: 404 });
  }

  return json(pinSet);
};

export const PUT: RequestHandler = async ({ params, request }) => {
  const body = (await request.json()) as UpsertPinSetRequest;

  const project = await prisma.project.findUnique({
    where: { id: params.projectId },
    select: { id: true },
  });

  if (!project) {
    return json({ error: "Project not found." }, { status: 404 });
  }

  if (body.identityAssetId) {
    const asset = await prisma.asset.findUnique({
      where: { id: body.identityAssetId },
      select: { id: true },
    });

    if (!asset) {
      return json({ error: "Identity asset not found." }, { status: 404 });
    }
  }

  const pinSet = await prisma.pinSet.upsert({
    where: { projectId: params.projectId },
    create: {
      projectId: params.projectId,
      identityAssetId: body.identityAssetId ?? null,
      wardrobeNotes: body.wardrobeNotes ?? null,
      lightingNotes: body.lightingNotes ?? null,
    },
    update: {
      identityAssetId: body.identityAssetId ?? null,
      wardrobeNotes: body.wardrobeNotes ?? null,
      lightingNotes: body.lightingNotes ?? null,
    },
  });

  return json(pinSet);
};
