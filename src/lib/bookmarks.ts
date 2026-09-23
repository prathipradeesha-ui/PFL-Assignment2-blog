const BOOKMARKS_KEY = "projecthub-bookmarks";

export function getBookmarks(): number[] {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const saved = localStorage.getItem(BOOKMARKS_KEY);

    if (!saved) {
      return [];
    }

    const parsed: unknown = JSON.parse(saved);

    if (
      Array.isArray(parsed) &&
      parsed.every((id) => Number.isInteger(id))
    ) {
      return parsed as number[];
    }

    return [];
  } catch {
    return [];
  }
}

export function toggleBookmark(postId: number): number[] {
  const bookmarks = getBookmarks();

  const updated = bookmarks.includes(postId)
    ? bookmarks.filter((id) => id !== postId)
    : [...bookmarks, postId];

  localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(updated));

  return updated;
}

export function isBookmarked(postId: number): boolean {
  return getBookmarks().includes(postId);
}
