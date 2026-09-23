
"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

type BlogPost = {
  id: number;
  title: string;
  author: string;
  description: string;
  tag: string;
  createdAt: string;
  coverImage?: string;
};

export default function NewPostPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [description, setDescription] = useState("");
  const [tag, setTag] = useState("");

  const [error, setError] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setError("");

    if (
      !title.trim() ||
      !author.trim() ||
      !description.trim() ||
      !tag
    ) {
      setError("Please complete all fields.");
      return;
    }

    const newPost = {
      title: title.trim(),
      author: author.trim(),
      description: description.trim(),
      tag,
    };

    try {
      setIsSaving(true);

      const response = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newPost),
      });

      const result: BlogPost | { error?: string } = await response.json();

      if (!response.ok) {
        const message =
          "error" in result && result.error
            ? result.error
            : "Could not save your post.";

        throw new Error(message);
      }

      router.push("/");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Something went wrong. Please try again."
      );
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f7f9fc] text-slate-800">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-5 sm:px-8">
          <Link href="/" className="text-xl font-bold tracking-tight">
            Project<span className="text-indigo-600">Hub</span>
          </Link>

          <Link
            href="/"
            className="text-sm font-medium text-slate-600 hover:text-indigo-600"
          >
            ← Back to posts
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-5 py-10 sm:px-8">
        <div className="mb-8">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-indigo-600">
            Share your idea
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
            Create a project post
          </h1>

          <p className="mt-3 text-slate-500">
            Tell the student community what you are building or exploring.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="space-y-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8"
        >
          <div>
            <label
              htmlFor="title"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Post title
            </label>

            <input
              id="title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              maxLength={120}
              placeholder="e.g. Smart Campus Monitoring System"
              className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              required
            />
          </div>

          <div>
            <label
              htmlFor="author"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Author or team name
            </label>

            <input
              id="author"
              value={author}
              onChange={(event) => setAuthor(event.target.value)}
              maxLength={80}
              placeholder="Enter your name or team"
              className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              required
            />
          </div>

          <div>
            <label
              htmlFor="description"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Project description
            </label>

            <textarea
              id="description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              maxLength={2000}
              rows={6}
              placeholder="Describe your project idea, its purpose, and what you hope to achieve..."
              className="w-full resize-y rounded-lg border border-slate-200 px-4 py-3 text-sm leading-6 outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              required
            />

            <p className="mt-1 text-right text-xs text-slate-400">
              {description.length}/2000 characters
            </p>
          </div>

          <div>
            <label
              htmlFor="tag"
              className="mb-2 block text-sm font-semibold text-slate-700"
            >
              Project tag
            </label>

            <select
              id="tag"
              value={tag}
              onChange={(event) => setTag(event.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-indigo-400 focus:ring-2 focus:ring-indigo-100"
              required
            >
              <option value="">Choose a tag</option>
              <option value="Web Development">Web Development</option>
              <option value="Artificial Intelligence">
                Artificial Intelligence
              </option>
              <option value="Internet of Things">Internet of Things</option>
              <option value="Sustainability">Sustainability</option>
              <option value="Cybersecurity">Cybersecurity</option>
              <option value="Accessibility">Accessibility</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {error && (
            <p
              role="alert"
              className="rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700"
            >
              {error}
            </p>
          )}

          <div className="flex flex-wrap justify-end gap-3 border-t border-slate-100 pt-5">
            <Link
              href="/"
              className="rounded-lg border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
            >
              Cancel
            </Link>

            <button
              type="submit"
              disabled={isSaving}
              className="rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-700 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSaving ? "Saving..." : "Save post"}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}