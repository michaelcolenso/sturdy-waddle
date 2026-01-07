import { json } from "@sveltejs/kit";
import prisma from "$lib/server/prisma";
import type { RequestHandler } from "./$types";

export const POST: RequestHandler = async ({ request }) => {
  const body = (await request.json()) as { name?: string };

  if (!body.name) {
    return json({ error: "Name is required." }, { status: 400 });
  }

  const project = await prisma.project.create({
    data: {
      name: body.name,
    },
  });

  return json(project, { status: 201 });
};
