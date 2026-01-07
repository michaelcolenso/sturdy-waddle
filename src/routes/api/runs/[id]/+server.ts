import { json } from "@sveltejs/kit";
import prisma from "$lib/server/prisma";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ params }) => {
  const run = await prisma.run.findUnique({
    where: { id: params.id },
    include: {
      assets: true,
    },
  });

  if (!run) {
    return json({ error: "Run not found." }, { status: 404 });
  }

  return json(run);
};
