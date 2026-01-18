import { useQuery } from "@tanstack/react-query";
import { getSinglePost } from "../Server/SinglePostApi/SinglePostApi";

export function useSinglePost(id) {
  return useQuery({
    queryKey: ["single-post", id],
    queryFn: () => getSinglePost(id),
    enabled: !!id,
    select: (data) => data.post,
  });
}
