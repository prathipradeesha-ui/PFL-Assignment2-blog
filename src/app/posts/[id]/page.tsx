"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { isBookmarked, toggleBookmark } from "@/lib/bookmarks";

type BlogPost = {
  id: number;
  title: string;
  author: string;
  description: string;
  tag: string;
  createdAt: string;
};

export default function PostDetailPage() {
  const params = useParams();
  const router = useRouter();
  const postId = String(params.id);

  const [post, setPost] = useState<BlogPost | null>(null);
  const [loading, setLoading] = useState(true);
  const [bookmarked, setBookmarked] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadPost() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`/api/posts/${postId}`);

        if (response.status === 404) {
          setPost(null);
          return;
        }

        if (!response.ok) {
          throw new Error("Unable to load this post.");
        }

        const foundPost: BlogPost = await response.json();

        setPost(foundPost);
        setBookmarked(isBookmarked(foundPost.id));
      } catch {
        setError("Unable to load the post. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    loadPost();
  }, [postId]);

  function handleBookmark() {
    if (!post) return;

    const updatedBookmarks = toggleBookmark(post.id);
    setBookmarked(updatedBookmarks.includes(post.id));
  }

  async function handleDelete() {
    if (!post || isDeleting) return;

    const confirmed = window.confirm(
      "Are you sure you want to delete this post? This action cannot be undone."
    );

    if (!confirmed) return;

    try {
      setIsDeleting(true);
      setError("");

      const response = await fetch(`/api/posts/${post.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Unable to delete the post.");
      }

      router.push("/");
      router.refresh();
    } catch {
      setError("Unable to delete the post. Please try again.");
      setIsDeleting(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 p-8 text-slate-900">
        <p className="font-medium">Loading post...</p>
      </main>
    );
  }

  if (error && !post) {
    return (
      <main className="mx-auto min-h-screen max-w-3xl bg-slate-50 p-8 text-slate-900">
        <h1 className="text-2xl font-bold">Something went wrong</h1>

        <p className="mt-3 text-red-700">{error}</p>

        <Link
          href="/"
          className="mt-4 inline-block font-semibold text-indigo-700 hover:underline"
        >
          ← Back to homepage
        </Link>
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
        <div className="flex flex-wrap items-center justify-between gap-4">
          <Link
            href="/"
            className="font-semibold text-indigo-700 hover:underline"
          >
            ← Back to homepage
          </Link>

          <Link
            href="/saved"
            className="font-semibold text-indigo-700 hover:underline"
          >
            View Bookmarks →
          </Link>
        </div>

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

          <div className="mt-6">
            <button
              type="button"
              onClick={handleBookmark}
              aria-pressed={bookmarked}
              className={`rounded-lg px-5 py-3 text-sm font-bold transition focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
                bookmarked
                  ? "border border-indigo-200 bg-indigo-100 text-indigo-800 hover:bg-indigo-200"
                  : "border border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
              }`}
            >
              {bookmarked ? "★ Bookmarked" : "☆ Bookmark"}
            </button>
          </div>

          <div className="mt-8 border-t border-slate-200 pt-6">
            <h2 className="text-lg font-bold text-slate-900">
              Project description
            </h2>

            <p className="mt-3 whitespace-pre-wrap leading-7 text-slate-700">
              {post.description}
            </p>
          </div>

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
              disabled={isDeleting}
              className="rounded-lg border border-red-300 bg-white px-5 py-3 text-sm font-bold text-red-700 hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isDeleting ? "Deleting..." : "Delete Post"}
            </button>
          </div>

          {error && (
            <p role="alert" className="mt-4 text-sm font-medium text-red-700">
              {error}
            </p>
          )}
        </article>
      </div>
    </main>
  );
}
