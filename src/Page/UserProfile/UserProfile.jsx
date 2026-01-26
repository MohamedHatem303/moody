import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import userImage from "../../assets/userImage.png";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  useDisclosure,
} from "@heroui/react";
import { useTheme } from "../../Context/themeContext";
import { Helmet } from "react-helmet";

export default function UserProfile() {
  const { theme } = useTheme();
  const location = useLocation();
  const passedUser = location.state?.user;

  const { isOpen, onOpenChange } = useDisclosure();
  const [imageUrl, setImageUrl] = useState("");

  const accentText = theme === "dark" ? "text-[#7C3AED]" : "text-[#35037F]";
  if (!passedUser) {
    return (
      <p className="text-center text-gray-500 mt-10">
        User data not available 👀
      </p>
    );
  }

  const userPhoto =
    passedUser.photo?.includes("default") || !passedUser.photo
      ? userImage
      : passedUser.photo;

  function openImageModal(url) {
    if (!url) return;
    setImageUrl(url);
    onOpenChange(true);
  }

  async function downloadImage(url) {
    const res = await fetch(url);
    const blob = await res.blob();
    const blobUrl = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = blobUrl;
    a.download = "profile.jpg";
    a.click();
    URL.revokeObjectURL(blobUrl);
  }

  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Moody</title>
        <link rel="icon" href="/bird.svg" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Helmet>
      <div className="w-full px-6 min-h-screen">
        <div className="bg-[#6F4BA5] rounded-2xl px-6 py-4 mb-6 flex justify-between mt-1 max-h-10 ">
          <h2 className=" text-lg font-semibold text-[#F5D98C] flex items-center">
            Profile
          </h2>
          <Link
            to="/Home"
            className={`flex items-center gap-2  text-[#F5D98C]`}
          >
            <h2 className="text-lg font-semibold flex items-center">Home</h2>
            <i className="fa-solid fa-house font-bold" />
          </Link>
        </div>
        <div className="max-w-2xl mx-auto bg-white dark:bg-[#0f0f14] rounded-2xl  p-6">
          <div className="flex flex-col items-center gap-4">
            <img
              src={userPhoto}
              onClick={() => openImageModal(userPhoto)}
              className="w-32 h-32 rounded-full cursor-pointer object-cover"
              alt={passedUser.name}
            />
            <h2 className="text-xl font-bold dark:text-white flex items-center gap-2">
              <i className="fa-solid fa-user text-[#6F4BA5]"></i>
              {passedUser.name}
            </h2>
          </div>
        </div>
      </div>
      <Modal
        placement={"center"}
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        backdrop="blur"
      >
        <ModalContent>
          <ModalHeader>Profile Photo</ModalHeader>
          <ModalBody>
            <img
              src={imageUrl}
              className="max-h-[70vh] w-full object-contain"
            />
          </ModalBody>
          <ModalFooter className="justify-center">
            <Button color="secondary" onPress={() => downloadImage(imageUrl)}>
              Download
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
