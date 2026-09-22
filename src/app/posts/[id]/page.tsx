
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

type BlogPost = {
  id: number;
  title: string;
  author: string;
  description: string;
  tag: string;
  createdAt: string;
};

const samplePosts: BlogPost[] = [
  {
    id: 1,
    title: "EcoTrack: A Sustainable Campus",
    author: "GreenTech Students",
    description:
      "A project exploring ways to make the campus more sustainable through technology.",
    tag: "Sustainability",
    createdAt: "2026-09-22",
  },
  {
    id: 2,
    title: "AI Customer Support Assistant",
    author: "Nexus Computing",
    description:
      "An AI-powered assistant designed to help answer customer questions.",
    tag: "Artificial Intelligence",
    createdAt: "2026-09-20",
  },
  {
    id: 3,
    title: "Student Expense Tracker",
    author: "RetailPlus Team",
    description:
      "A web application that helps students record and manage their expenses.",
    tag: "Web Development",
    createdAt: "2026-09-18",
  },
];

export default function PostDetailPage() {
  const params = useParams();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedPosts: BlogPost[] = JSON.parse(
      localStorage.getItem("projecthub-posts") || "[]"
    );

    const allPosts = [...savedPosts, ...samplePosts];

    const selectedPost = allPosts.find(
      (item) => String(item.id) === String(params.id)
    );

    setPost(selectedPost || null);
    setLoading(false);
  }, [params.id]);

  if (loading) {
    return <main className="p-8">Loading post...</main>;
  }

  if (!post) {
    return (
      <main className="mx-auto max-w-3xl p-8">
        <h1 className="text-2xl font-bold">Post not found</h1>
        <Link href="/" className="mt-4 inline-block text-blue-600">
          ← Back to homepage
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-3xl px-6 py-10">
      <Link href="/" className="text-blue-600 hover:underline">
        ← Back to homepage
      </Link>

      <article className="mt-8 rounded-xl border bg-white p-8 shadow-sm">
        <span className="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-700">
          {post.tag}
        </span>

        <h1 className="mt-5 text-3xl font-bold text-gray-900">
          {post.title}
        </h1>

        <p className="mt-3 text-sm text-gray-500">
          By {post.author}
        </p>

        <p className="mt-6 whitespace-pre-wrap leading-7 text-gray-700">
          {post.description}
        </p>

        <p className="mt-8 text-sm text-gray-400">
          Posted: {new Date(post.createdAt).toLocaleDateString()}
        </p>
      </article>
    </main>
  );
}
