import axios from "axios";
import { getUserIdFromToken } from "../../utils/getUserIdFromToken";

export async function UserPosts() {
  const userId = getUserIdFromToken();

  const { data } = await axios.get(
    `https://linked-posts.routemisr.com/users/${userId}/posts`,
    {
      headers: {
        token: localStorage.getItem("token"),
      },
      params: {
        limit: 1000,
      },
    },
  );

  return data.posts.reverse();
}
