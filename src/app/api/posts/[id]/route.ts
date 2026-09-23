
import { NextResponse } from "next/server";
import {
  deletePost,
  getPostById,
  updatePost,
} from "@/lib/postStorage";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{ id: string }>;
};

async function getValidId(context: RouteContext): Promise<number | null> {
  const { id } = await context.params;
  const parsedId = Number(id);

  if (!Number.isSafeInteger(parsedId) || parsedId <= 0) {
    return null;
  }

  return parsedId;
}

export async function GET(
  _request: Request,
  context: RouteContext
) {
  const id = await getValidId(context);

  if (id === null) {
    return NextResponse.json({ error: "Invalid post ID" }, { status: 400 });
  }

  try {
    const post = await getPostById(id);

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json(post);
  } catch {
    return NextResponse.json(
      { error: "Unable to retrieve post" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  context: RouteContext
) {
  const id = await getValidId(context);

  if (id === null) {
    return NextResponse.json({ error: "Invalid post ID" }, { status: 400 });
  }

  try {
    const body: unknown = await request.json();

    if (
      typeof body !== "object" ||
      body === null ||
      !("title" in body) ||
      !("author" in body) ||
      !("description" in body) ||
      !("tag" in body) ||
      typeof body.title !== "string" ||
      typeof body.author !== "string" ||
      typeof body.description !== "string" ||
      typeof body.tag !== "string" ||
      !body.title.trim() ||
      !body.author.trim() ||
      !body.description.trim() ||
      !body.tag.trim()
    ) {
      return NextResponse.json(
        { error: "Please provide valid post fields" },
        { status: 400 }
      );
    }

    const post = await updatePost(id, {
      title: body.title.trim(),
      author: body.author.trim(),
      description: body.description.trim(),
      tag: body.tag.trim(),
      ...( "coverImage" in body && typeof body.coverImage === "string"
        ? { coverImage: body.coverImage }
        : {}),
    });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json(post);
  } catch {
    return NextResponse.json(
      { error: "Unable to update post" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: Request,
  context: RouteContext
) {
  const id = await getValidId(context);

  if (id === null) {
    return NextResponse.json({ error: "Invalid post ID" }, { status: 400 });
  }

  try {
    const deleted = await deletePost(id);

    if (!deleted) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json(
      { error: "Unable to delete post" },
      { status: 500 }
    );
  }
}
