
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

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
  const router = useRouter();

  const [post, setPost] = useState<BlogPost | null>(null);
  const [isUserPost, setIsUserPost] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadPost = () => {
      try {
        const savedPosts: BlogPost[] = JSON.parse(
          localStorage.getItem("projecthub-posts") || "[]"
        );

        const userPost = savedPosts.find(
          (item) => String(item.id) === String(params.id)
        );

        if (userPost) {
          setPost(userPost);
          setIsUserPost(true);
        } else {
          const samplePost = samplePosts.find(
            (item) => String(item.id) === String(params.id)
          );

          setPost(samplePost || null);
          setIsUserPost(false);
        }
      } catch {
        setPost(null);
        setIsUserPost(false);
      } finally {
        setLoading(false);
      }
    };

    queueMicrotask(loadPost);
  }, [params.id]);

  function handleDelete() {
    if (!post || !isUserPost) {
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to delete this post? This action cannot be undone."
    );

    if (!confirmed) {
      return;
    }

    try {
      const savedPosts: BlogPost[] = JSON.parse(
        localStorage.getItem("projecthub-posts") || "[]"
      );

      const updatedPosts = savedPosts.filter(
        (item) => String(item.id) !== String(post.id)
      );

      localStorage.setItem(
        "projecthub-posts",
        JSON.stringify(updatedPosts)
      );

      router.push("/");
      router.refresh();
    } catch {
      window.alert("Unable to delete the post. Please try again.");
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 p-8 text-slate-900">
        <p className="font-medium">Loading post...</p>
      </main>
    );
  }

  if (!post) {
    return (
      <main className="mx-auto min-h-screen max-w-3xl bg-slate-50 p-8 text-slate-900">
        <h1 className="text-2xl font-bold">Post not found</h1>

        <p className="mt-3 text-slate-700">
          This post may have been removed or does not exist.
        </p>

        <Link
          href="/"
          className="mt-4 inline-block font-semibold text-indigo-700 hover:underline"
        >
          ← Back to homepage
        </Link>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10 text-slate-900">
      <div className="mx-auto max-w-3xl">
        <Link
          href="/"
          className="font-semibold text-indigo-700 hover:underline"
        >
          ← Back to homepage
        </Link>

        <article className="mt-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="rounded-full bg-indigo-100 px-3 py-1 text-sm font-semibold text-indigo-800">
              {post.tag}
            </span>

            <time className="text-sm text-slate-600">
              {new Date(post.createdAt).toLocaleDateString()}
            </time>
          </div>

          <h1 className="mt-5 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            {post.title}
          </h1>

          <p className="mt-3 text-sm text-slate-600">
            Posted by{" "}
            <span className="font-semibold text-slate-800">
              {post.author}
            </span>
          </p>

          <div className="mt-8 border-t border-slate-200 pt-6">
            <h2 className="text-lg font-bold text-slate-900">
              Project description
            </h2>

            <p className="mt-3 whitespace-pre-wrap leading-7 text-slate-700">
              {post.description}
            </p>
          </div>

          {isUserPost && (
            <div className="mt-8 flex flex-wrap gap-3 border-t border-slate-200 pt-6">
              <Link
                href={`/posts/${post.id}/edit`}
                className="rounded-lg bg-indigo-700 px-5 py-3 text-sm font-bold text-white hover:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Edit Post
              </Link>

              <button
                type="button"
                onClick={handleDelete}
                className="rounded-lg border border-red-300 bg-white px-5 py-3 text-sm font-bold text-red-700 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
              >
                Delete Post
              </button>
            </div>
          )}
        </article>
      </div>
    </main>
  );
}