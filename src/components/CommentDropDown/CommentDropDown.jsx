import React, { useState } from "react";
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
import { deleteMyComment } from "../../Server/DeleteCommentApi/DeleteCommentApi";
import { updateMyComment } from "../../Server/UpdateCommentApi/UpdateCommentApi";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useTheme } from "../../Context/themeContext";

export default function CommentDropDown({
  commentId,
  commentBodyOld,
  Dimensions,
  placement,
}) {
  const { theme } = useTheme();

  const [open, setOpen] = useState(false);
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [commentBody, setCommentBody] = useState("");
  const [isLoadingDelete, setIsLoadingDelete] = useState(false);
  const [isLoadingUpdate, setIsLoadingUpdate] = useState(false);
  const queryClient = useQueryClient();

  async function deleteComment() {
    toast.success("Comment deleted successfully 🗑️");
    setIsLoadingDelete(true);
    await deleteMyComment(commentId);
    queryClient.invalidateQueries(["posts"]);
    queryClient.invalidateQueries(["single-post"]);
    setIsLoadingDelete(false);
    setOpen(false);
  }

  async function updateComment(e) {
    e.preventDefault();
    toast.success("Comment updated successfully ✏️");
    setIsLoadingUpdate(true);
    await updateMyComment(commentBody, commentId);
    queryClient.invalidateQueries(["posts"]);
    queryClient.invalidateQueries(["single-post"]);
    onOpenChange(false);
    setIsLoadingUpdate(false);
  }

  const dropdownBg =
    theme === "dark" ? "bg-[#16161D] text-white" : "bg-white text-gray-900";

  const inputClasses =
    theme === "dark"
      ? "bg-[#1C1C26] text-white border border-[#2F2F45]"
      : "bg-gray-100 text-gray-900 border border-gray-300";

  return (
    <>
      <Dropdown placement={placement} isOpen={open} onOpenChange={setOpen}>
        <DropdownTrigger>
          <i
            className={`fa-solid fa-ellipsis transition ${
              theme === "dark"
                ? "text-gray-400 hover:text-[#7C3AED]"
                : "text-gray-500 hover:text-[#35037F]"
            }`}
          />
        </DropdownTrigger>

        <DropdownMenu className={dropdownBg} closeOnSelect={false}>
          <DropdownItem
            key="edit"
            color="secondary"
            onPress={() => {
              setCommentBody(commentBodyOld);
              setOpen(false);
              onOpen();
            }}
          >
            Edit
          </DropdownItem>

          <DropdownItem key="delete" color="danger" onPress={deleteComment}>
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
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        placement="center"
        isDismissable={!isLoadingUpdate}
        isKeyboardDismissDisabled={isLoadingUpdate}
      >
        <ModalContent
          className={theme === "dark" ? "bg-[#16161D] text-white" : ""}
        >
          {(onClose) => (
            <form onSubmit={updateComment}>
              <ModalHeader>Edit Comment</ModalHeader>

              <ModalBody>
                <input
                  value={commentBody}
                  onChange={(e) => setCommentBody(e.target.value)}
                  className={`w-full rounded-xl p-3 outline-none ${inputClasses}`}
                />
              </ModalBody>

              <ModalFooter>
                <Button variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button
                  color="secondary"
                  type="submit"
                  isLoading={isLoadingUpdate}
                >
                  Save
                </Button>
              </ModalFooter>
            </form>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
