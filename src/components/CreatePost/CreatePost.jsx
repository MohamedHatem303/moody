import { useContext, useRef, useState } from "react";
import { createMyPost } from "../../Server/CreatePostApi/CreatePostApi";
import { Button } from "@heroui/react";
import { AuthContext } from "../../Context/authContext";
import userImage from "../../assets/userImage.png";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useTheme } from "../../Context/themeContext";

export default function CreatePost() {
  const { theme } = useTheme();

  const [postBody, setpostBody] = useState("");
  const [image, setimage] = useState(null);
  const [imageUrl, setimageUrl] = useState("");
  const [isLoading, setisLoading] = useState(false);

  const { userData } = useContext(AuthContext);
  const queryClient = useQueryClient();
  const fileInputRef = useRef(null);

  async function addPost(e) {
    e.preventDefault();
    if (!postBody.trim() && !image) return;

    setisLoading(true);

    const formData = new FormData();
    if (postBody.trim()) formData.append("body", postBody);
    if (image) formData.append("image", image);

    const response = await createMyPost(formData);

    if (response?.message === "success") {
      setpostBody("");
      setimage(null);
      setimageUrl("");
      toast.success("Post created successfully");
      if (fileInputRef.current) fileInputRef.current.value = "";
      queryClient.invalidateQueries(["posts"]);
    }

    setisLoading(false);
  }

  const cardClasses =
    theme === "dark"
      ? "bg-[#16161D] border-[#2F2F45]"
      : "bg-white border-gray-200";

  const inputClasses =
    theme === "dark"
      ? "bg-[#1C1C26] text-white border border-[#2F2F45]"
      : "bg-gray-100 text-gray-900 border border-gray-200";

  const photoBtnClasses =
    theme === "dark"
      ? "bg-[#2A2A3A] text-gray-200"
      : "bg-purple-100 text-purple-700";

  return (
    <div
      className={`w-full rounded-2xl mt-4 p-4 border transition-colors ${cardClasses}`}
    >
      <form onSubmit={addPost}>
        <div className="flex gap-3">
          <img
            src={
              userData?.photo?.includes("default")
                ? userImage
                : userData?.photo
            }
            className="w-10 h-10 rounded-full"
            alt="user"
          />

          <input
            value={postBody}
            onChange={(e) => setpostBody(e.target.value)}
            placeholder="What's on your mind?"
            className={`flex-1 rounded-xl p-3 outline-none ${inputClasses}`}
          />
        </div>

        <div className="flex justify-between items-center mt-4">
          <div className="ms-14">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className={`px-4 py-2 rounded-xl font-semibold flex items-center gap-2 transition ${photoBtnClasses}`}
            >
              <i className="fa-regular fa-image"></i>
              Photo
            </button>

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (!file) return;

                setimage(file);
                setimageUrl(URL.createObjectURL(file));
              }}
            />
          </div>

          <Button
            isLoading={isLoading}
            type="submit"
            className="px-5 py-2 rounded-xl bg-[#7C3AED] hover:bg-[#6D28D9] text-white font-semibold flex items-center gap-2"
          >
            <i className="fa-solid fa-paper-plane"></i>
            Post
          </Button>
        </div>
      </form>

      {imageUrl && (
        <div className="relative mt-3">
          <img
            src={imageUrl}
            className="w-full rounded-xl"
            alt="preview"
          />

          <svg
            onClick={() => {
              setimage(null);
              setimageUrl("");
              if (fileInputRef.current) fileInputRef.current.value = "";
            }}
            className="size-8 absolute top-1 right-2 cursor-pointer text-gray-400 hover:text-red-500 transition"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18 18 6M6 6l12 12"
            />
          </svg>
        </div>
      )}
    </div>
  );
}
