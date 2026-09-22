
"use client";

import { useEffect, useState, type FormEvent } from "react";
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

const fieldClass =
  "w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-base text-slate-900 placeholder:text-slate-500 focus:border-indigo-600 focus:outline-none focus:ring-2 focus:ring-indigo-200";

const labelClass =
  "mb-2 block text-sm font-semibold text-slate-800";

export default function EditPostPage() {
  const params = useParams();
  const router = useRouter();

  const [post, setPost] = useState<BlogPost | null>(null);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [description, setDescription] = useState("");
  const [tag, setTag] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const savedPosts: BlogPost[] = JSON.parse(
        localStorage.getItem("projecthub-posts") || "[]"
      );

      const foundPost = savedPosts.find(
        (item) => String(item.id) === String(params.id)
      );

      if (foundPost) {
        setPost(foundPost);
        setTitle(foundPost.title);
        setAuthor(foundPost.author);
        setDescription(foundPost.description);
        setTag(foundPost.tag);
      }
    } catch {
      setError("Could not load the saved post. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [params.id]);

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (!post) {
      setError("This post could not be found.");
      return;
    }

    if (
      !title.trim() ||
      !author.trim() ||
      !description.trim() ||
      !tag.trim()
    ) {
      setError("Please complete all fields.");
      return;
    }

    try {
      const savedPosts: BlogPost[] = JSON.parse(
        localStorage.getItem("projecthub-posts") || "[]"
      );

      const updatedPosts = savedPosts.map((item) =>
        item.id === post.id
          ? {
              ...item,
              title: title.trim(),
              author: author.trim(),
              description: description.trim(),
              tag: tag.trim(),
            }
          : item
      );

      localStorage.setItem(
        "projecthub-posts",
        JSON.stringify(updatedPosts)
      );

      router.push(`/posts/${post.id}`);
      router.refresh();
    } catch {
      setError("Could not save your changes. Please try again.");
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
      <main className="min-h-screen bg-slate-50 px-6 py-10 text-slate-900">
        <div className="mx-auto max-w-2xl rounded-xl border border-slate-200 bg-white p-8">
          <h1 className="text-2xl font-bold">Post not found</h1>

          <p className="mt-3 text-slate-700">
            {error || "This post may have been removed or does not exist."}
          </p>

          <Link
            href="/"
            className="mt-5 inline-block font-semibold text-indigo-700 hover:underline"
          >
            ← Back to homepage
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10 text-slate-900">
      <div className="mx-auto max-w-2xl">
        <Link
          href={`/posts/${post.id}`}
          className="font-semibold text-indigo-700 hover:underline"
        >
          ← Cancel and return
        </Link>

        <section className="mt-6 rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Edit Post
          </h1>

          <p className="mt-2 text-base text-slate-700">
            Update your project information below.
          </p>

          {error && (
            <p
              role="alert"
              className="mt-5 rounded-lg border border-red-200 bg-red-50 p-3 text-sm font-medium text-red-800"
            >
              {error}
            </p>
          )}

          <form onSubmit={handleSubmit} className="mt-7 space-y-5">
            <div>
              <label htmlFor="title" className={labelClass}>
                Project title
              </label>

              <input
                id="title"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                required
                className={fieldClass}
              />
            </div>

            <div>
              <label htmlFor="author" className={labelClass}>
                Author or team
              </label>

              <input
                id="author"
                value={author}
                onChange={(event) => setAuthor(event.target.value)}
                required
                className={fieldClass}
              />
            </div>

            <div>
              <label htmlFor="description" className={labelClass}>
                Project description
              </label>

              <textarea
                id="description"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                required
                rows={6}
                className={`${fieldClass} resize-y leading-6`}
              />
            </div>

            <div>
              <label htmlFor="tag" className={labelClass}>
                Project tag
              </label>

              <input
                id="tag"
                value={tag}
                onChange={(event) => setTag(event.target.value)}
                required
                className={fieldClass}
              />
            </div>

            <div className="flex flex-wrap gap-3 border-t border-slate-200 pt-5">
              <button
                type="submit"
                className="rounded-lg bg-indigo-700 px-5 py-3 text-sm font-bold text-white transition hover:bg-indigo-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
              >
                Save Changes
              </button>

              <Link
                href={`/posts/${post.id}`}
                className="rounded-lg border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-800 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-400"
              >
                Cancel
              </Link>
            </div>
          </form>
        </section>
      </div>
    </main>
  );
}
