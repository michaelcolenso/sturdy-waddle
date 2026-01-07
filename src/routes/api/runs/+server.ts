import { json } from "@sveltejs/kit";
import prisma from "$lib/server/prisma";
import type { RequestHandler } from "./$types";

type CreateRunRequest = {
  projectId?: string;
  recipeVersionId?: string | null;
  provider?: "OPENAI" | "GEMINI";
  mode?: "GENERATE" | "EDIT";
  paramsJson?: unknown;
  status?: "PENDING" | "RUNNING" | "SUCCEEDED" | "FAILED";
  error?: string | null;
};

export const POST: RequestHandler = async ({ request }) => {
  const body = (await request.json()) as CreateRunRequest;

  if (!body.projectId || !body.provider || !body.mode || body.paramsJson === undefined) {
    return json(
      { error: "projectId, provider, mode, and paramsJson are required." },
      { status: 400 }
    );
  }

  const project = await prisma.project.findUnique({
    where: { id: body.projectId },
    select: { id: true },
  });

  if (!project) {
    return json({ error: "Project not found." }, { status: 404 });
  }

  if (body.recipeVersionId) {
    const version = await prisma.recipeVersion.findUnique({
      where: { id: body.recipeVersionId },
      select: { id: true },
    });

    if (!version) {
      return json({ error: "Recipe version not found." }, { status: 404 });
    }
  }

  const run = await prisma.run.create({
    data: {
      projectId: body.projectId,
      recipeVersionId: body.recipeVersionId ?? null,
      provider: body.provider,
      mode: body.mode,
      paramsJson: body.paramsJson,
      status: body.status ?? "PENDING",
      error: body.error ?? null,
    },
  });

  return json(run, { status: 201 });
};
