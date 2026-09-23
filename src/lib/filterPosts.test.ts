import { describe, it, expect } from "vitest";
import { filterPosts, type BlogPost } from "./filterPosts";

const posts: BlogPost[] = [
  {
    id: 1,
    title: "EcoTrack",
    description: "A Sustainable Campus",
    author: "GreenTech Students",
    tag: "Sustainability",
    createdAt: "2026-09-22T10:00:00Z",
  },
  {
    id: 2,
    title: "AI Customer Support Assistant",
    description: "An AI chatbot project",
    author: "Nexus Computing",
    tag: "Artificial Intelligence",
    createdAt: "2026-09-20T10:00:00Z",
  },
  {
    id: 3,
    title: "Student Expense Tracker",
    description: "A web app for tracking expenses",
    author: "RetailPlus Team",
    tag: "Web Development",
    createdAt: "2026-09-18T10:00:00Z",
  },
];

describe("filterPosts", () => {
  it("finds posts by title", () => {
    expect(filterPosts(posts, "EcoTrack", "All").map((p) => p.id))
      .toEqual([1]);
  });

  it("finds posts by author", () => {
    expect(filterPosts(posts, "Nexus Computing", "All").map((p) => p.id))
      .toEqual([2]);
  });

  it("filters posts by tag", () => {
    expect(filterPosts(posts, "", "Sustainability").map((p) => p.id))
      .toEqual([1]);
  });

  it("combines search and tag filters", () => {
    expect(filterPosts(posts, "campus", "Sustainability").map((p) => p.id))
      .toEqual([1]);
  });

  it("ignores search letter case", () => {
    expect(filterPosts(posts, "ecotrack", "All").map((p) => p.id))
      .toEqual([1]);
  });

  it("returns no posts for an unmatched search", () => {
    expect(filterPosts(posts, "nonexistent", "All"))
      .toEqual([]);
  });
});