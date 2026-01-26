import axios from "axios";

export async function updateMyPost(postId, formData) {
  const res = await axios.put(
    `https://linked-posts.routemisr.com/posts/${postId}`,
    formData,
    {
      headers: {
        token: localStorage.getItem("token"),
      },
    },
  );

  return res.data;
}
