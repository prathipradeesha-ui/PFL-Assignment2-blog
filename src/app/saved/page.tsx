"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { getBookmarks, toggleBookmark } from "@/lib/bookmarks";

type BlogPost = {
  id: number;
  title: string;
  description: string;
  author: string;
  tag: string;
  createdAt: string;
};

export default function SavedPostsPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [bookmarkedIds, setBookmarkedIds] = useState<number[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    async function loadBookmarkedPosts() {
      try {
        const response = await fetch("/api/posts");
        const allPosts: BlogPost[] = await response.json();

        const ids = getBookmarks();

        setBookmarkedIds(ids);
        setPosts(allPosts.filter((post) => ids.includes(post.id)));
      } catch {
        setPosts([]);
        setBookmarkedIds([]);
      } finally {
        setLoaded(true);
      }
    }

    loadBookmarkedPosts();
  }, []);

  function handleRemove(postId: number) {
    const updatedIds = toggleBookmark(postId);

    setBookmarkedIds(updatedIds);
    setPosts((currentPosts) =>
      currentPosts.filter((post) => updatedIds.includes(post.id))
    );
  }

  if (!loaded) {
    return (
      <main className="min-h-screen bg-slate-50 p-8 text-slate-900">
        <p>Loading bookmarks...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-5 py-8 text-slate-900 sm:px-8">
      <div className="mx-auto max-w-5xl">
        <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-indigo-600">
              ProjectHub
            </p>
            <h1 className="mt-2 text-3xl font-bold">Bookmarks</h1>
            <p className="mt-2 text-slate-600">
              Your bookmarked student projects.
            </p>
          </div>

          <Link
            href="/"
            className="rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold hover:border-indigo-400 hover:text-indigo-700"
          >
            ← Back to posts
          </Link>
        </header>

        {posts.length === 0 ? (
          <section className="rounded-xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
            <h2 className="text-xl font-semibold">No bookmarks yet</h2>
            <p className="mt-2 text-slate-600">
              Visit the homepage and select Save on a project you want to keep.
            </p>
            <Link
              href="/"
              className="mt-5 inline-block rounded-lg bg-indigo-600 px-4 py-2.5 font-semibold text-white hover:bg-indigo-700"
            >
              Explore posts
            </Link>
          </section>
        ) : (
          <section className="grid gap-5 md:grid-cols-2">
            {posts.map((post) => (
              <article
                key={post.id}
                className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
                    {post.tag}
                  </span>

                  <button
                    type="button"
                    onClick={() => handleRemove(post.id)}
                    className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm font-semibold text-slate-700 hover:border-red-300 hover:text-red-700"
                  >
                    Unsave
                  </button>
                </div>

                <h2 className="mt-4 text-xl font-bold">
                  <Link
                    href={`/posts/${post.id}`}
                    className="hover:text-indigo-700 hover:underline"
                  >
                    {post.title}
                  </Link>
                </h2>

                <p className="mt-2 text-sm text-slate-600">
                  {post.description}
                </p>

                <p className="mt-4 text-xs text-slate-500">
                  By {post.author}
                </p>
              </article>
            ))}
          </section>
        )}

        <p className="mt-8 text-sm text-slate-500">
          {bookmarkedIds.length} saved{" "}
          {bookmarkedIds.length === 1 ? "post" : "posts"}
        </p>
      </div>
    </main>
  );
}
