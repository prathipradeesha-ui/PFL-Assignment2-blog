
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";

type BlogPost = {
  id: number;
  title: string;
  description: string;
  author: string;
  tag: string;
  createdAt: string;
};

const samplePosts: BlogPost[] = [
  {
    id: 1,
    title: "EcoTrack: A Sustainable Campus",
    description:
      "A student project exploring how technology can help universities monitor energy use, reduce waste, and build greener campuses.",
    author: "GreenTech Students",
    tag: "Sustainability",
    createdAt: "2026-09-22T10:00:00.000Z",
  },
  {
    id: 2,
    title: "AI Customer Support Assistant",
    description:
      "Building an intelligent chatbot to answer common student questions and help users find information more efficiently.",
    author: "Nexus Computing",
    tag: "Artificial Intelligence",
    createdAt: "2026-09-20T10:00:00.000Z",
  },
  {
    id: 3,
    title: "Student Expense Tracker",
    description:
      "A web application concept that helps students organise spending, track expenses, and understand their monthly budget.",
    author: "RetailPlus Team",
    tag: "Web Development",
    createdAt: "2026-09-18T10:00:00.000Z",
  },
];

export default function Home() {
  const [search, setSearch] = useState("");
  const [selectedTag, setSelectedTag] = useState("All Tags");
  const [posts, setPosts] = useState<BlogPost[]>(samplePosts);

  // Load user-created posts from localStorage.
  useEffect(() => {
    const savedPosts = localStorage.getItem("projecthub-posts");

    if (savedPosts) {
      try {
        const parsedPosts: BlogPost[] = JSON.parse(savedPosts);

        if (Array.isArray(parsedPosts)) {
          const combinedPosts = [...parsedPosts, ...samplePosts];

          // Display newest posts first.
          combinedPosts.sort(
            (a, b) =>
              new Date(b.createdAt).getTime() -
              new Date(a.createdAt).getTime()
          );

          setPosts(combinedPosts);
        }
      } catch {
        console.error("Could not read saved ProjectHub posts.");
      }
    }
  }, []);

  const allTags = [
    "All Tags",
    ...Array.from(new Set(posts.map((post) => post.tag))),
  ];

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const searchText = search.toLowerCase();

      const matchesSearch =
        post.title.toLowerCase().includes(searchText) ||
        post.description.toLowerCase().includes(searchText) ||
        post.author.toLowerCase().includes(searchText);

      const matchesTag =
        selectedTag === "All Tags" || post.tag === selectedTag;

      return matchesSearch && matchesTag;
    });
  }, [posts, search, selectedTag]);

  // Show up to three newest matching posts.
  const latestPosts = filteredPosts.slice(0, 3);

  function clearFilters() {
    setSearch("");
    setSelectedTag("All Tags");
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
      {/* Top navigation */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-5 sm:px-8">
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

          <div className="flex items-center gap-4">
            <span className="hidden text-sm text-slate-500 sm:block">
              Student Project Community
            </span>

            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700">
              PH
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <div className="mx-auto max-w-7xl px-5 py-8 sm:px-8 sm:py-10">
        {/* Page heading */}
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

        {/* Search and tag filters */}
        <section
          aria-label="Search and filter posts"
          className="mb-7 rounded-xl border border-slate-200 bg-white p-3 shadow-sm sm:p-4"
        >
          <div className="grid gap-3 md:grid-cols-[1fr_230px_auto]">
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
              <span className="shrink-0 text-sm text-slate-500">
                Tag
              </span>

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

            <button
              type="button"
              onClick={clearFilters}
              className="rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-600 transition hover:bg-slate-100"
            >
              Clear filters
            </button>
          </div>
        </section>

        {/* Latest posts */}
        <section id="latest-posts">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-slate-900">
                Latest posts
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

          {/* Clickable post cards */}
          {latestPosts.length > 0 ? (
            <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {latestPosts.map((post) => (
                <Link
                  key={post.id}
                  href={`/posts/${post.id}`}
                  className="block rounded-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
                >
                  <article className="flex min-h-[300px] flex-col overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md">
                    <div className="flex-1 p-5 sm:p-6">
                      <div className="mb-4 flex items-start justify-between gap-3">
                        <div className="flex min-w-0 items-center gap-2 text-xs text-slate-500">
                          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-slate-100 text-slate-500">
                            <svg
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="1.7"
                              className="h-4 w-4"
                              aria-hidden="true"
                            >
                              <path d="M4 20V8l8-4 8 4v12" />
                              <path d="M2 20h20M9 20v-6h6v6M8 9h.01M12 9h.01M16 9h.01" />
                            </svg>
                          </span>

                          <span className="truncate">{post.author}</span>
                        </div>

                        <span className="shrink-0 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">
                          Recent
                        </span>
                      </div>

                      <h3 className="text-xl font-bold leading-snug text-slate-900">
                        {post.title}
                      </h3>

                      <p className="mt-3 line-clamp-3 text-sm leading-6 text-slate-500">
                        {post.description}
                      </p>

                      <div className="mt-5 flex flex-wrap gap-2">
                        <span className="rounded-md bg-indigo-50 px-2.5 py-1.5 text-xs font-medium text-indigo-700">
                          {post.tag}
                        </span>
                      </div>
                    </div>

                    {/* Card footer */}
                    <div className="border-t border-slate-100 bg-slate-50/70 px-5 py-4 sm:px-6">
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex min-w-0 items-center gap-2 text-xs text-slate-500">
                          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white text-[10px] font-bold text-slate-600 ring-1 ring-slate-200">
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
                </Link>
              ))}
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

        {/* Footer */}
        <footer className="mt-12 border-t border-slate-200 pt-5 text-center text-xs text-slate-400">
          ProjectHub · A project-sharing blog for Software Engineering students
        </footer>
      </div>
    </main>
  );
}
