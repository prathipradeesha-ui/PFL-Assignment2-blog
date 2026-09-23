
export type BlogPost = {
  id: number;
  title: string;
  description: string;
  author: string;
  tag: string;
  createdAt: string;
  coverImage?: string;
};

export function filterPosts(
  posts: BlogPost[],
  searchTerm: string,
  selectedTag: string
): BlogPost[] {
  const normalizedSearch = searchTerm.trim().toLowerCase();

  return posts.filter((post) => {
    const matchesSearch =
      normalizedSearch === "" ||
      post.title.toLowerCase().includes(normalizedSearch) ||
      post.description.toLowerCase().includes(normalizedSearch) ||
      post.author.toLowerCase().includes(normalizedSearch) ||
      post.tag.toLowerCase().includes(normalizedSearch);

    const matchesTag =
      selectedTag === "All" || post.tag === selectedTag;

    return matchesSearch && matchesTag;
  });
}
