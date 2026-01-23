import axios from "axios";

export async function getAllPosts({ pageParam = 1 }) {
  const res = await axios.get(
    "https://linked-posts.routemisr.com/posts",
    {
      headers: {
        token: localStorage.getItem("token"),
      },
      params: {
        page: pageParam,
        limit: 50,
        sort: "-createdAt",
      },
    }
  );

  return {
    posts: res.data.posts,
  };
}
