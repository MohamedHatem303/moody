import { useInfiniteQuery } from "@tanstack/react-query";
import { getAllPosts } from "../Server/PostApi/PostApi";

export function usePosts() {
  const query = useInfiniteQuery({
    queryKey: ["posts"],
    queryFn: getAllPosts,
    getNextPageParam: (lastPage, allPages) =>
      lastPage.posts.length > 0 ? allPages.length + 1 : undefined,
  });

  const posts = query.data?.pages.flatMap((p) => p.posts) ?? [];

  return {
    ...query,
    posts,
  };
}
