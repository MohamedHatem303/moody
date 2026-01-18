import { useQuery } from "@tanstack/react-query";
import { UserPosts } from "../Server/UserPostsApi/UserPostsApi";

export function useUserPosts() {
  return useQuery({
    queryKey: ["user-posts"],      
    queryFn: UserPosts,            
    staleTime: 1000 * 60 * 5,       
    cacheTime: 1000 * 60 * 10,      
    refetchOnWindowFocus: false,  
    retry: false,
  });
}
