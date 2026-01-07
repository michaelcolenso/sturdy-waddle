import { json } from "@sveltejs/kit";
import prisma from "$lib/server/prisma";
import type { RequestHandler } from "./$types";

type CreateRecipeRequest = {
  projectId?: string;
  name?: string;
  draftSpecJson?: unknown;
};

export const POST: RequestHandler = async ({ request }) => {
  const body = (await request.json()) as CreateRecipeRequest;

  if (!body.projectId || !body.name || body.draftSpecJson === undefined) {
    return json({ error: "projectId, name, and draftSpecJson are required." }, { status: 400 });
  }

  const project = await prisma.project.findUnique({
    where: { id: body.projectId },
    select: { id: true },
  });

  if (!project) {
    return json({ error: "Project not found." }, { status: 404 });
  }

  const recipe = await prisma.recipe.create({
    data: {
      projectId: body.projectId,
      name: body.name,
      draftSpecJson: body.draftSpecJson,
    },
  });

  return json(recipe, { status: 201 });
};
