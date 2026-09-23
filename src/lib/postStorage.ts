
import { readFile, writeFile } from "node:fs/promises";
import path from "node:path";
import type { BlogPost } from "./filterPosts";

const dataDirectory = path.join(process.cwd(), "data");
const dataFile = path.join(dataDirectory, "posts.json");

async function ensureDataFile() {
  await import("node:fs/promises").then(({ mkdir }) =>
    mkdir(dataDirectory, { recursive: true })
  );

  try {
    await readFile(dataFile, "utf-8");
  } catch {
    await writeFile(dataFile, "[]", "utf-8");
  }
}

export async function getAllPosts(): Promise<BlogPost[]> {
  await ensureDataFile();

  const contents = await readFile(dataFile, "utf-8");
  const posts: unknown = JSON.parse(contents);

  if (!Array.isArray(posts)) {
    throw new Error("Invalid posts data");
  }

  return posts as BlogPost[];
}

export async function getPostById(
  id: number
): Promise<BlogPost | undefined> {
  const posts = await getAllPosts();
  return posts.find((post) => post.id === id);
}

export async function createPost(
  postData: Omit<BlogPost, "id" | "createdAt">
): Promise<BlogPost> {
  const posts = await getAllPosts();

  const newPost: BlogPost = {
    ...postData,
    id: Date.now(),
    createdAt: new Date().toISOString(),
  };

  posts.push(newPost);
  await writeFile(dataFile, JSON.stringify(posts, null, 2), "utf-8");

  return newPost;
}

export async function updatePost(
  id: number,
  updates: Partial<Omit<BlogPost, "id" | "createdAt">>
): Promise<BlogPost | undefined> {
  const posts = await getAllPosts();
  const index = posts.findIndex((post) => post.id === id);

  if (index === -1) {
    return undefined;
  }

  posts[index] = {
    ...posts[index],
    ...updates,
  };

  await writeFile(dataFile, JSON.stringify(posts, null, 2), "utf-8");

  return posts[index];
}

export async function deletePost(id: number): Promise<boolean> {
  const posts = await getAllPosts();
  const updatedPosts = posts.filter((post) => post.id !== id);

  if (updatedPosts.length === posts.length) {
    return false;
  }

  await writeFile(dataFile, JSON.stringify(updatedPosts, null, 2), "utf-8");
  return true;
}
