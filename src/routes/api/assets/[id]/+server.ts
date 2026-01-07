import { json } from "@sveltejs/kit";
import prisma from "$lib/server/prisma";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ params }) => {
  const asset = await prisma.asset.findUnique({
    where: { id: params.id },
  });

  if (!asset) {
    return json({ error: "Asset not found." }, { status: 404 });
  }

  return json(asset);
};
