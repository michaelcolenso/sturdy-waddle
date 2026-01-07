import { json } from "@sveltejs/kit";
import prisma from "$lib/server/prisma";
import type { RequestHandler } from "./$types";

type UpdateRecipeRequest = {
  name?: string;
  draftSpecJson?: unknown;
};

export const PATCH: RequestHandler = async ({ params, request }) => {
  const body = (await request.json()) as UpdateRecipeRequest;

  if (body.name === undefined && body.draftSpecJson === undefined) {
    return json({ error: "No fields provided for update." }, { status: 400 });
  }

  const existing = await prisma.recipe.findUnique({
    where: { id: params.id },
    select: { id: true },
  });

  if (!existing) {
    return json({ error: "Recipe not found." }, { status: 404 });
  }

  const recipe = await prisma.recipe.update({
    where: { id: params.id },
    data: {
      name: body.name,
      draftSpecJson: body.draftSpecJson,
    },
  });

  return json(recipe);
};
