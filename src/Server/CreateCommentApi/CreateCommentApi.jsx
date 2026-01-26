import axios from "axios";
export async function createMyComment(content, id) {
  try {
    let { data } = await axios.post(
      `https://linked-posts.routemisr.com/comments`,
      {
        content: content,
        post: id,
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
