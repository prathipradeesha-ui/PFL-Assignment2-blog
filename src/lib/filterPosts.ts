export type BlogPost = {
  id: number;
  title: string;
  description: string;
  author: string;
  tag: string;
  createdAt: string;
};

export function filterPosts(
  posts: BlogPost[],
  searchTerm: string,
  selectedTag: string
): BlogPost[] {
  const query = searchTerm.trim().toLowerCase();

  return posts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(query) ||
      post.description.toLowerCase().includes(query) ||
      post.author.toLowerCase().includes(query);

    const matchesTag =
      selectedTag === "All" || post.tag === selectedTag;

    return matchesSearch && matchesTag;
  });
}