import React, { useContext, useState } from "react";
import CommentsCard from "../CommentsCard/CommentsCard";
import { Link } from "react-router-dom";
import { createMyComment } from "../../Server/CreateCommentApi/CreateCommentApi";
import { AuthContext } from "../../Context/authContext";
import userImage from "../../assets/userImage.png";
import PostDropdown from "../postDropdown/postDropdown";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@heroui/react";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useTheme } from "../../Context/themeContext";

export default function Post({ post, allcomment }) {
  const { theme } = useTheme();

  const [showCommentBox, setShowCommentBox] = useState(false);
  const [likes, setLikes] = useState(() => Math.floor(Math.random() * 500) + 1);
  const [liked, setLiked] = useState(false);
  const [commentContent, setcommentContent] = useState("");
  const [commentIsLoading, setcommentIsLoading] = useState(false);

  const { isOpen: isImageOpen, onOpenChange: onOpenChangeImage } =
    useDisclosure();
  const [imageModalUrl, setImageModalUrl] = useState("");

  const { userData } = useContext(AuthContext);
  const queryClient = useQueryClient();

  const shouldShowCommentBox = allcomment || showCommentBox;

  function openImageModal(url) {
    setImageModalUrl(url);
    onOpenChangeImage(true);
  }

  function getTimeAgo(dateString) {
    const createdDate = new Date(dateString);
    const now = new Date();
    const diffMinutes = Math.floor((now - createdDate) / 60000);
    if (diffMinutes < 1) return "Just now";
    if (diffMinutes < 60) return `${diffMinutes} min ago`;
    if (diffMinutes < 1440) return `${Math.floor(diffMinutes / 60)} h ago`;
    return `${Math.floor(diffMinutes / 1440)} d ago`;
  }

  function handleLike() {
    setLikes((prev) => (liked ? prev - 1 : prev + 1));

    toast(liked ? "Like removed" : "Liked", {
      icon: liked ? "💔" : "❤️",
    });

    setLiked((prev) => !prev);
  }

  function handleComment() {
    setShowCommentBox((prev) => !prev);
  }

  async function createComment(e) {
    e.preventDefault();
    setcommentIsLoading(true);

    const response = await createMyComment(commentContent, post.id);
    if (response.message === "success") {
      setcommentContent("");
      setShowCommentBox(false);
      toast.success("Comment added successfully");
      queryClient.invalidateQueries(["posts"]);
      queryClient.invalidateQueries(["single-post"]);
    }

    setcommentIsLoading(false);
  }

  async function downloadImage(url) {
    const res = await fetch(url);
    const blob = await res.blob();
    const blobUrl = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = blobUrl;
    a.download = "image.jpg";
    a.click();
    URL.revokeObjectURL(blobUrl);
    toast.success("Photo downloaded successfully");
  }

  function handleShare() {
    const postLink = `${window.location.origin}/SinglePost/${post.id}`;

    if (navigator.clipboard && window.isSecureContext) {
      // للـ browsers الحديثة
      navigator.clipboard
        .writeText(postLink)
        .then(() => toast.success("Link copied"))
        .catch(() => fallbackCopy(postLink));
    } else {
      // fallback للموبايل
      fallbackCopy(postLink);
    }
  }

  function fallbackCopy(text) {
    const textarea = document.createElement("textarea");
    textarea.value = text;

    textarea.style.position = "fixed";
    textarea.style.top = "-9999px";

    document.body.appendChild(textarea);
    textarea.focus();
    textarea.select();

    try {
      document.execCommand("copy");
      toast.success("Link copied");
    } catch (err) {
      toast.error("Failed to copy link");
    }

    document.body.removeChild(textarea);
  }


  const cardClasses =
    theme === "dark"
      ? "bg-[#16161D] border-[#2F2F45] text-[#EDEDF0]"
      : "bg-white border-gray-200 text-gray-900";

  const mutedText = theme === "dark" ? "text-gray-400" : "text-gray-500";

  return (
    <>
      <div
        className={`${
          !allcomment ? "rounded-2xl shadow-sm" : ""
        } border w-full overflow-hidden my-3 ${cardClasses}`}
      >
        <div
          className={`${
            allcomment ? "rounded-2xl shadow-sm mb-5" : ""
          }`}
        >
          <div className="flex justify-between">
            <Link
              to={
                userData?._id === post.user._id
                  ? "/Profile"
                  : `/UserProfile/${post.user._id}`
              }
              state={
                userData?._id === post.user._id
                  ? null
                  : { user: post.user }
              }
              className="flex items-center gap-3 py-5 px-2"
            >
              <img
                src={
                  post.user?.photo?.includes("default")
                    ? userImage
                    : post.user?.photo
                }
                className="w-10 h-10 rounded-full"
              />
              <div>
                <p className="font-semibold">{post.user.name}</p>
                <span className={`text-sm ${mutedText}`}>
                  {getTimeAgo(post.createdAt)}
                </span>
              </div>
            </Link>

            {userData?._id === post.user._id && (
              <div className="p-3">
                <PostDropdown
                  postId={post._id}
                  postBodyOld={post.body}
                  postImageOld={post.image}
                  allcomment={allcomment}
                />
              </div>
            )}
          </div>

          <hr className="my-2 border-gray-300 dark:border-gray-700" />

          {post.body && (
            <p className="mt-3 px-4 mb-2">{post.body}</p>
          )}

          {post.image && (
            <div
              className="w-full cursor-pointer"
              onClick={() => openImageModal(post.image)}
            >
              <img
                src={post.image}
                className="w-full object-cover rounded-md"
              />
            </div>
          )}

          <div
            className={`flex text-sm px-4 mt-2 ${
              !allcomment ? "justify-between" : ""
            } ${mutedText}`}
          >
            <span>{likes} likes</span>
            {!allcomment && <span>{post.comments?.length || 0} comments</span>}
          </div>

          <hr className="my-3 border-gray-300 dark:border-gray-700" />

          <div className="flex justify-around px-6 pb-3 select-none">
            <button
              onClick={handleLike}
              className={`flex items-center gap-2 transition ${
                liked ? "text-[#7C3AED]" : mutedText
              }`}
            >
              <i
                className={`${
                  liked ? "fa-solid" : "fa-regular"
                } fa-heart text-lg`}
              />
              {liked ? "Liked" : "Like"}
            </button>

            {!allcomment && (
              <button
                onClick={handleComment}
                className={`flex items-center gap-2 transition ${
                  showCommentBox ? "text-[#7C3AED]" : mutedText
                }`}
              >
                <i
                  className={`${
                    showCommentBox ? "fa-solid" : "fa-regular"
                  } fa-comment text-lg`}
                />
                Comment
              </button>
            )}

            <button
              onClick={handleShare}
              className={`flex items-center gap-2 transition ${mutedText}`}
            >
              <i className="fa-solid fa-arrow-up-from-bracket text-lg" />
              Share
            </button>
          </div>
        </div>

        {shouldShowCommentBox && (
          <form
            onSubmit={createComment}
            className={`flex items-center gap-2 px-4 pb-3 ${
              allcomment ? "pt-3" : ""
            }`}
          >
            <input
              value={commentContent}
              onChange={(e) => setcommentContent(e.target.value)}
              placeholder="Write a comment..."
              className={`flex-1 min-w-0 px-4 py-2 rounded-full border outline-none ${
                theme === "dark"
                  ? "bg-[#1C1C26] border-[#2F2F45] text-white"
                  : "bg-white border-gray-300"
              }`}
            />
            <Button
              isLoading={commentIsLoading}
              className="bg-[#7C3AED] hover:bg-[#6D28D9] text-white px-5 py-2 rounded-full"
              type="submit"
            >
              <i className="fa-regular fa-paper-plane"></i>
            </Button>
          </form>
        )}

        {!allcomment && post.comments?.length > 0 && (
          <>
            <CommentsCard
              id={post.user._id}
              comment={post.comments[post.comments.length - 1]}
              getTimeAgo={getTimeAgo}
              allcomment={false}
            />

            <Link to={`/SinglePost/${post.id}`}>
              <p className="text-[#7C3AED] font-medium hover:underline my-1 px-4 pb-4 ms-10">
                View all {post.comments.length} comments
              </p>
            </Link>
          </>
        )}

        {allcomment && post.comments?.length > 0 && (
          <>
            <h1 className="font-bold text-lg px-4 pb-2">
              All Comments ({post.comments.length})
            </h1>

            {post.comments.map((comment) => (
              <CommentsCard
                key={comment._id}
                id={post.user._id}
                comment={comment}
                getTimeAgo={getTimeAgo}
                allcomment={true}
              />
            ))}
          </>
        )}
      </div>

      <Modal
        backdrop="blur"
        isOpen={isImageOpen}
        onOpenChange={onOpenChangeImage}
        size="xl"
      >
        <ModalContent
          className={theme === "dark" ? "bg-[#16161D] text-white" : ""}
        >
          <ModalHeader>Photo</ModalHeader>
          <ModalBody>
            <img
              src={imageModalUrl}
              alt="Post"
              className="max-h-[70vh] w-full object-contain"
            />
          </ModalBody>
          <ModalFooter className="flex justify-center">
            <Button
              color="secondary"
              onPress={() => downloadImage(imageModalUrl)}
            >
              Download
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
