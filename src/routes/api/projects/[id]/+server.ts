import { json } from "@sveltejs/kit";
import prisma from "$lib/server/prisma";
import type { RequestHandler } from "./$types";

export const GET: RequestHandler = async ({ params }) => {
  const project = await prisma.project.findUnique({
    where: { id: params.id },
    include: {
      recipes: true,
      runs: true,
      pinSet: true,
    },
  });

  if (!project) {
    return json({ error: "Project not found." }, { status: 404 });
  }

  return json(project);
};
