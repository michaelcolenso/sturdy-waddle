import { json } from "@sveltejs/kit";
import prisma from "$lib/server/prisma";
import type { RequestHandler } from "./$types";

type CreateVersionRequest = {
  specJson?: unknown;
  compiledPromptOpenAI?: string;
  compiledPromptGemini?: string;
  note?: string;
};

export const POST: RequestHandler = async ({ params, request }) => {
  const body = (await request.json()) as CreateVersionRequest;

  const recipe = await prisma.recipe.findUnique({
    where: { id: params.id },
    select: { id: true, draftSpecJson: true },
  });

  if (!recipe) {
    return json({ error: "Recipe not found." }, { status: 404 });
  }

  const latestVersion = await prisma.recipeVersion.findFirst({
    where: { recipeId: recipe.id },
    orderBy: { versionNumber: "desc" },
    select: { versionNumber: true },
  });

  const versionNumber = latestVersion ? latestVersion.versionNumber + 1 : 1;

  const recipeVersion = await prisma.recipeVersion.create({
    data: {
      recipeId: recipe.id,
      versionNumber,
      specJson: body.specJson ?? recipe.draftSpecJson,
      compiledPromptOpenAI: body.compiledPromptOpenAI ?? "",
      compiledPromptGemini: body.compiledPromptGemini ?? "",
      note: body.note,
    },
  });

  return json(recipeVersion, { status: 201 });
};
