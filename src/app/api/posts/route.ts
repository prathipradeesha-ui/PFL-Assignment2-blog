
import { NextResponse } from "next/server";
import { createPost, getAllPosts } from "@/lib/postStorage";

export const runtime = "nodejs";

export async function GET() {
  try {
    const posts = await getAllPosts();

    return NextResponse.json(posts);
  } catch {
    return NextResponse.json(
      { error: "Unable to retrieve posts" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
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
        { error: "Please provide a valid title, author, description, and tag." },
        { status: 400 }
      );
    }

    const post = await createPost({
      title: body.title.trim(),
      author: body.author.trim(),
      description: body.description.trim(),
      tag: body.tag.trim(),
      ...( "coverImage" in body && typeof body.coverImage === "string"
        ? { coverImage: body.coverImage }
        : {}),
    });

    return NextResponse.json(post, { status: 201 });
  } catch {
    return NextResponse.json(
      { error: "Unable to create post" },
      { status: 500 }
    );
  }
}
