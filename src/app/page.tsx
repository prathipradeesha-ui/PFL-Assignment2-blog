"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { filterPosts } from "@/lib/filterPosts";
import { getBookmarks, toggleBookmark } from "@/lib/bookmarks";

type BlogPost = {
  id: number;
  title: string;
  description: string;
  author: string;
  tag: string;
  createdAt: string;
  coverImage?: string;
};

type SortOption = "newest" | "oldest" | "title";

const coverImages: Record<number, string> = {
  1: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=900&q=80",
  2: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=900&q=80",
  3: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=900&q=80",
};

const fallbackCover =
  "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=900&q=80";

export default function Home() {
  const [search, setSearch] = useState("");
  const [selectedTag, setSelectedTag] = useState("All Tags");
  const [sortOption, setSortOption] = useState<SortOption>("newest");
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [bookmarkedIds, setBookmarkedIds] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  // Load posts from the API.
  useEffect(() => {
    async function loadPosts() {
      try {
        setIsLoading(true);
        setError("");

        const response = await fetch("/api/posts");

        if (!response.ok) {
          throw new Error("Failed to load posts.");
        }

        const apiPosts: BlogPost[] = await response.json();

        const postsWithCovers = apiPosts.map((post) => ({
          ...post,
          coverImage: post.coverImage || coverImages[post.id],
        }));

        setPosts(postsWithCovers);
      } catch {
        setError("Could not load posts. Please refresh the page.");
      } finally {
        setIsLoading(false);
      }
    }

    loadPosts();
  }, []);

  // Load bookmarks from localStorage.
  useEffect(() => {
    queueMicrotask(() => {
      setBookmarkedIds(getBookmarks());
    });
  }, []);

  const allTags = [
    "All Tags",
    ...Array.from(new Set(posts.map((post) => post.tag))),
  ];

  const sortedAndFilteredPosts = useMemo(() => {
    const filtered = filterPosts(
      posts,
      search,
      selectedTag === "All Tags" ? "All" : selectedTag
    );

    return [...filtered].sort((a, b) => {
      if (sortOption === "oldest") {
        return (
          new Date(a.createdAt).getTime() -
          new Date(b.createdAt).getTime()
        );
      }

      if (sortOption === "title") {
        return a.title.localeCompare(b.title);
      }

      return (
        new Date(b.createdAt).getTime() -
        new Date(a.createdAt).getTime()
      );
    });
  }, [posts, search, selectedTag, sortOption]);

  const latestPosts = sortedAndFilteredPosts.slice(0, 3);

  function clearFilters() {
    setSearch("");
    setSelectedTag("All Tags");
    setSortOption("newest");
  }

  function handleBookmark(postId: number) {
    const updatedBookmarks = toggleBookmark(postId);
    setBookmarkedIds(updatedBookmarks);
  }

  function formatDate(dateString: string) {
    const date = new Date(dateString);

    if (Number.isNaN(date.getTime())) {
      return "Date unavailable";
    }

    return date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  function getInitials(author: string) {
    return author
      .trim()
      .split(/\s+/)
      .map((word) => word[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }

  return (
    <main className="min-h-screen bg-[#f7f9fc] text-slate-800">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex min-h-16 max-w-7xl items-center justify-between gap-4 px-5 py-3 sm:px-8">
          <Link href="/" className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-indigo-600 text-white">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="h-5 w-5"
                aria-hidden="true"
              >
                <rect x="3" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="3" width="7" height="7" rx="1" />
                <rect x="3" y="14" width="7" height="7" rx="1" />
                <rect x="14" y="14" width="7" height="7" rx="1" />
              </svg>
            </span>

            <span className="text-xl font-bold tracking-tight">
              Project<span className="text-indigo-600">Hub</span>
            </span>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/saved"
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm font-semibold text-slate-700 hover:border-indigo-300 hover:text-indigo-700"
            >
              Saved Posts ({bookmarkedIds.length})
            </Link>

            <span className="hidden text-sm text-slate-500 sm:block">
              Student Project Community
            </span>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 sm:py-10">
        <div className="mb-7 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-indigo-600">
              Student community
            </p>

            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              Project posts
            </h1>

            <p className="mt-2 text-sm text-slate-500 sm:text-base">
              Explore ideas, share your work, and find inspiration for your
              final-year project.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <a
              href="#latest-posts"
              className="rounded-lg border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-indigo-300 hover:text-indigo-700"
            >
              Latest posts ↓
            </a>

            <Link
              href="/new"
              className="rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700"
            >
              + Create Post
            </Link>
          </div>
        </div>

        <section
          aria-label="Search, filter and sort posts"
          className="mb-7 rounded-xl border border-slate-200 bg-white p-3 shadow-sm sm:p-4"
        >
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-[1fr_200px_200px_auto]">
            <label className="flex min-w-0 items-center gap-3 rounded-lg border border-slate-200 bg-white px-3.5 focus-within:border-indigo-400 focus-within:ring-2 focus-within:ring-indigo-100">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                className="h-5 w-5 shrink-0 text-slate-400"
                aria-hidden="true"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="m16 16 4 4" />
              </svg>

              <input
                type="search"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Search project posts..."
                aria-label="Search project posts"
                className="h-11 w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
              />
            </label>

            <label className="flex items-center gap-3 rounded-lg border border-slate-200 px-3.5">
              <span className="shrink-0 text-sm text-slate-500">Tag</span>

              <select
                value={selectedTag}
                onChange={(event) => setSelectedTag(event.target.value)}
                aria-label="Filter posts by tag"
                className="h-11 min-w-0 flex-1 bg-transparent text-sm text-slate-700 outline-none"
              >
                {allTags.map((tag) => (
                  <option key={tag} value={tag}>
                    {tag}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex items-center gap-3 rounded-lg border border-slate-200 px-3.5">
              <span className="shrink-0 text-sm text-slate-500">Sort</span>

              <select
                value={sortOption}
                onChange={(event) =>
                  setSortOption(event.target.value as SortOption)
                }
                aria-label="Sort project posts"
                className="h-11 min-w-0 flex-1 bg-transparent text-sm text-slate-700 outline-none"
              >
                <option value="newest">Newest first</option>
                <option value="oldest">Oldest first</option>
                <option value="title">Title A–Z</option>
              </select>
            </label>

            <button
              type="button"
              onClick={clearFilters}
              className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100"
            >
              Clear
            </button>
          </div>
        </section>

        <section id="latest-posts">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                {sortOption === "newest"
                  ? "Latest posts"
                  : sortOption === "oldest"
                    ? "Oldest posts"
                    : "Projects A–Z"}
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Discover what students are working on.
              </p>
            </div>

            <span className="rounded-full bg-white px-3 py-1.5 text-xs font-medium text-slate-500 ring-1 ring-slate-200">
              {latestPosts.length}{" "}
              {latestPosts.length === 1 ? "post" : "posts"} shown
            </span>
          </div>

          {isLoading ? (
            <p className="rounded-xl border border-slate-200 bg-white p-8 text-center text-slate-500">
              Loading posts...
            </p>
          ) : error ? (
            <p
              role="alert"
              className="rounded-xl border border-red-200 bg-white p-8 text-center text-red-600"
            >
              {error}
            </p>
          ) : latestPosts.length > 0 ? (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {latestPosts.map((post) => {
                const isSaved = bookmarkedIds.includes(post.id);

                return (
                  <article
                    key={post.id}
                    className="flex flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:border-indigo-200 hover:shadow-lg"
                  >
                    <Link
                      href={`/posts/${post.id}`}
                      className="block overflow-hidden focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                      aria-label={`View ${post.title}`}
                    >
                      <div className="relative h-44 w-full overflow-hidden">
                        <Image
                          src={post.coverImage || fallbackCover}
                          alt={`Cover for ${post.title}`}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                          className="object-cover transition duration-300 hover:scale-105"
                        />
                      </div>
                    </Link>

                    <div className="flex flex-1 flex-col p-5 sm:p-6">
                      <div className="mb-4 flex items-start justify-between gap-3">
                        <span className="rounded-md bg-indigo-50 px-2.5 py-1.5 text-xs font-medium text-indigo-700">
                          {post.tag}
                        </span>

                        <button
                          type="button"
                          onClick={() => handleBookmark(post.id)}
                          aria-pressed={isSaved}
                          className={`shrink-0 rounded-lg border px-3 py-1.5 text-xs font-semibold transition ${
                            isSaved
                              ? "border-indigo-200 bg-indigo-50 text-indigo-700"
                              : "border-slate-200 bg-white text-slate-600 hover:border-indigo-300 hover:text-indigo-700"
                          }`}
                        >
                          {isSaved ? "★ Saved" : "☆ Save"}
                        </button>
                      </div>

                      <Link
                        href={`/posts/${post.id}`}
                        className="block rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                      >
                        <h3 className="text-xl font-bold leading-snug text-slate-900">
                          {post.title}
                        </h3>

                        <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-500">
                          {post.description}
                        </p>
                      </Link>

                      <div className="mt-auto flex items-center justify-between gap-3 pt-5">
                        <div className="flex min-w-0 items-center gap-2 text-xs text-slate-500">
                          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-100 text-[10px] font-bold text-slate-600">
                            {getInitials(post.author)}
                          </span>
                          <span className="truncate">{post.author}</span>
                        </div>

                        <time className="shrink-0 text-xs text-slate-500">
                          {formatDate(post.createdAt)}
                        </time>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="rounded-xl border border-dashed border-slate-300 bg-white px-6 py-14 text-center">
              <h3 className="font-semibold text-slate-800">
                No matching posts found
              </h3>

              <p className="mt-2 text-sm text-slate-500">
                Try another search term or clear your filters.
              </p>

              <button
                type="button"
                onClick={clearFilters}
                className="mt-4 rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700"
              >
                Clear filters
              </button>
            </div>
          )}
        </section>

        <footer className="mt-12 border-t border-slate-200 pt-5 text-center text-xs text-slate-400">
          ProjectHub · A project-sharing blog for Software Engineering students
        </footer>
      </div>
    </main>
  );
}