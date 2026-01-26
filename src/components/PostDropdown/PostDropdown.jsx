import React, { useEffect, useRef, useState } from "react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Spinner,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@heroui/react";
import { deleteMyPost } from "../../Server/DeletePostApi/DeletePostApi";
import { updateMyPost } from "../../Server/UpdatePostApi/UpdatePostApi";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useTheme } from "../../Context/themeContext";

export default function PostDropdown({
  postId,
  allcomment,
  postBodyOld,
  postImageOld,
}) {
  const { theme } = useTheme();

  const [open, setOpen] = useState(false);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  const [postBody, setPostBody] = useState("");
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const [removedImage, setRemovedImage] = useState(false);
  const [isLoadingDelete, setIsLoadingDelete] = useState(false);
  const [isLoadingUpdate, setIsLoadingUpdate] = useState(false);

  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const fileInputRef = useRef(null);
  const inputRef = useRef(null);
  const modalContentRef = useRef(null);
  const modalBodyRef = useRef(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const mm = window.matchMedia("(max-width: 639px)");
    const onMatch = () => setIsMobile(mm.matches);
    onMatch();
    mm.addEventListener?.("change", onMatch);
    return () => mm.removeEventListener?.("change", onMatch);
  }, []);

  useEffect(() => {
    if (!isMobile) {
      if (modalContentRef.current) modalContentRef.current.style.height = "";
      return;
    }

    const vv = window.visualViewport;

    function applyHeight() {
      const h = vv ? vv.height : window.innerHeight;
      if (modalContentRef.current) {
        modalContentRef.current.style.height = `${h}px`;
      }
    }

    applyHeight();

    if (vv) {
      vv.addEventListener("resize", applyHeight);
      vv.addEventListener("scroll", applyHeight);
    } else {
      window.addEventListener("resize", applyHeight);
    }

    return () => {
      if (vv) {
        vv.removeEventListener("resize", applyHeight);
        vv.removeEventListener("scroll", applyHeight);
      } else {
        window.removeEventListener("resize", applyHeight);
      }
    };
  }, [isMobile]);

  function openEdit() {
    setPostBody(postBodyOld || "");
    setImageUrl(postImageOld || "");
    setImage(null);
    setRemovedImage(false);
    setOpen(false);
    onOpen();
    setTimeout(() => {
      if (modalBodyRef.current) modalBodyRef.current.scrollTop = 0;
    }, 50);
  }

  async function deletePost() {
    toast.success("Post deleted successfully 🗑️");
    setIsLoadingDelete(true);
    if (allcomment) navigate("/Home");

    try {
      const res = await deleteMyPost(postId);
      if (res?.message === "success") {
        queryClient.invalidateQueries(["posts"]);
        queryClient.invalidateQueries(["user-posts"]);
        queryClient.invalidateQueries(["single-post"]);
      }
    } finally {
      setIsLoadingDelete(false);
      setOpen(false);
    }
  }

  async function updatePost(e) {
    toast.success("Post updated successfully ✏️");
    e.preventDefault();
    setIsLoadingUpdate(true);

    try {
      const formData = new FormData();
      if (postBody?.trim()) formData.append("body", postBody);
      if (image) formData.append("image", image);
      if (removedImage) formData.append("removeImage", "true");

      const res = await updateMyPost(postId, formData);
      if (res?.message === "success") {
        queryClient.invalidateQueries(["posts"]);
        queryClient.invalidateQueries(["user-posts"]);
        queryClient.invalidateQueries(["single-post"]);

        setPostBody("");
        setImage(null);
        setImageUrl("");
        setRemovedImage(false);
        if (fileInputRef.current) fileInputRef.current.value = null;
        onOpenChange(false);
      }
    } finally {
      setIsLoadingUpdate(false);
    }
  }

  function handleChooseClick() {
    if (fileInputRef.current) fileInputRef.current.value = null;
    fileInputRef.current?.click();
  }

  function handleImg(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setImage(file);
    setRemovedImage(false);
    setImageUrl(URL.createObjectURL(file));
  }

  const iconColor =
    theme === "dark"
      ? "text-gray-400 hover:text-[#7C3AED]"
      : "text-gray-500 hover:text-[#35037F]";

  const dropdownBg =
    theme === "dark" ? "bg-[#16161D] text-white" : "bg-white text-gray-900";

  const modalBg = theme === "dark" ? "bg-[#16161D] text-white" : "";

  const inputClasses =
    theme === "dark"
      ? "bg-[#1C1C26] text-white border border-[#2F2F45]"
      : "bg-gray-100 text-gray-900 border border-gray-200";

  const photoBtn =
    theme === "dark"
      ? "bg-[#2A2A3A] text-gray-200"
      : "bg-purple-100 text-purple-700";

  return (
    <>
      <Dropdown placement="left" isOpen={open} onOpenChange={setOpen}>
        <DropdownTrigger>
          <i className={`fa-solid fa-ellipsis transition ${iconColor}`} />
        </DropdownTrigger>

        <DropdownMenu className={dropdownBg} closeOnSelect={false}>
          <DropdownItem key="edit" color="secondary" onPress={openEdit}>
            Edit
          </DropdownItem>

          <DropdownItem key="delete" color="danger" onPress={deletePost}>
            {isLoadingDelete ? (
              <span className="flex items-center gap-2">
                <Spinner size="sm" /> Deleting...
              </span>
            ) : (
              "Delete"
            )}
          </DropdownItem>
        </DropdownMenu>
      </Dropdown>

      <Modal
        backdrop="blur"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        placement="center"
        size="xl"
        isDismissable={!isLoadingUpdate}
        isKeyboardDismissDisabled={isLoadingUpdate}
      >
        <ModalContent
          ref={modalContentRef}
          className={`flex flex-col max-h-[90vh] ${modalBg}`}
        >
          {(onClose) => (
            <form onSubmit={updatePost} className="flex flex-col min-h-0">
              <ModalHeader>Edit Post</ModalHeader>

              <ModalBody
                ref={modalBodyRef}
                className="flex-1 min-h-0 overflow-y-auto px-4"
              >
                <div className="w-full max-w-md mx-auto py-4">
                  <input
                    ref={inputRef}
                    value={postBody}
                    onChange={(e) => setPostBody(e.target.value)}
                    placeholder="What's on your mind?"
                    className={`w-full rounded-xl p-3 outline-none ${inputClasses}`}
                  />

                  <div className="flex gap-3 items-center mt-4">
                    <button
                      type="button"
                      onClick={handleChooseClick}
                      className={`px-4 py-2 rounded-xl font-semibold flex items-center gap-2 ${photoBtn}`}
                    >
                      <i className="fa-regular fa-image" />
                      {imageUrl ? "Change Photo" : "Add Photo"}
                    </button>

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImg}
                    />

                    <button
                      type="button"
                      disabled={!imageUrl}
                      onClick={() => {
                        setImage(null);
                        setImageUrl("");
                        setRemovedImage(true);
                      }}
                      className={`px-4 py-2 rounded-xl font-semibold flex items-center gap-2 ${
                        imageUrl
                          ? "bg-red-100 text-red-700"
                          : "bg-gray-200 text-gray-400 cursor-not-allowed"
                      }`}
                    >
                      <i className="fa-solid fa-trash" />
                      Remove Photo
                    </button>
                  </div>

                  {imageUrl && (
                    <div className="mt-4">
                      <img
                        src={imageUrl}
                        alt="post"
                        className="w-full rounded-xl object-contain max-h-[45vh] sm:max-h-[320px]"
                      />
                    </div>
                  )}

                  <div className="flex gap-3 justify-end mt-6 sm:hidden">
                    <Button color="danger" variant="light" onPress={onClose}>
                      Cancel
                    </Button>
                    <Button
                      color="secondary"
                      type="submit"
                      isLoading={isLoadingUpdate}
                    >
                      Save Changes
                    </Button>
                  </div>
                </div>
              </ModalBody>

              <ModalFooter className="hidden sm:flex">
                <Button color="danger" variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button
                  color="secondary"
                  type="submit"
                  isLoading={isLoadingUpdate}
                >
                  Save Changes
                </Button>
              </ModalFooter>
            </form>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
