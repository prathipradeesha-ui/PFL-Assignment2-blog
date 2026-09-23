
import { beforeEach, describe, expect, it, vi } from "vitest";

const storage = new Map<string, string>();

vi.stubGlobal("localStorage", {
  getItem: (key: string) => storage.get(key) ?? null,
  setItem: (key: string, value: string) => {
    storage.set(key, value);
  },
  removeItem: (key: string) => {
    storage.delete(key);
  },
});

vi.stubGlobal("window", {});

import {
  getBookmarks,
  toggleBookmark,
  isBookmarked,
} from "./bookmarks";

describe("Bookmark helper", () => {
  beforeEach(() => {
    storage.clear();
  });

  it("returns an empty array when no bookmarks exist", () => {
    expect(getBookmarks()).toEqual([]);
  });

  it("saves a post bookmark", () => {
    expect(toggleBookmark(1)).toEqual([1]);
    expect(getBookmarks()).toEqual([1]);
  });

  it("removes a bookmark when toggled again", () => {
    toggleBookmark(1);

    expect(toggleBookmark(1)).toEqual([]);
    expect(getBookmarks()).toEqual([]);
  });

  it("supports bookmarking multiple posts", () => {
    toggleBookmark(1);
    toggleBookmark(2);

    expect(getBookmarks()).toEqual([1, 2]);
  });

  it("checks whether a post is bookmarked", () => {
    toggleBookmark(5);

    expect(isBookmarked(5)).toBe(true);
    expect(isBookmarked(6)).toBe(false);
  });

  it("returns an empty array for invalid stored JSON", () => {
    storage.set("projecthub-bookmarks", "{invalid json");

    expect(getBookmarks()).toEqual([]);
  });

  it("returns an empty array when stored data is not an array of integers", () => {
    storage.set("projecthub-bookmarks", JSON.stringify(["1", 2]));

    expect(getBookmarks()).toEqual([]);
  });
});
