import axios from "axios";

export async function changePassword({ password, newPassword }) {
  const token = localStorage.getItem("token");

  const { data } = await axios.patch(
    "https://linked-posts.routemisr.com/users/change-password",
    {
      password,
      newPassword,
    },
    {
      headers: {
        token,
      },
    }
  );

  return data;
}
