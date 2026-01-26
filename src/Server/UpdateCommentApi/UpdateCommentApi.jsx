import axios from "axios";
export async function updateMyComment(content, id) {
  try {
    let { data } = await axios.put(
      `https://linked-posts.routemisr.com/comments/${id}`,
      {
        content: content,
      },
      {
        headers: {
          token: localStorage.getItem("token"),
        },
      },
    );
    return data;
  } catch (error) {
    return error;
  }
}
