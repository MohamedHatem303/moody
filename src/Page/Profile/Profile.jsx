import React, { useContext, useState } from "react";
import userImage from "../../assets/userImage.png";
import { AuthContext } from "../../Context/authContext";
import { Link, useParams, useLocation } from "react-router-dom";
import Post from "../../components/Post/Post";
import LoadingPage from "../../components/LoadingPage/LoadingPage";
import { useUserPosts } from "../../Hooks/useUserPosts";
import { useTheme } from "../../Context/themeContext";
import { Helmet } from "react-helmet";
import { Modal, ModalContent, ModalBody } from "@heroui/react";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const { theme } = useTheme();
  const { userData } = useContext(AuthContext);
  const { id } = useParams();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const passedUser = location.state?.user;
  const isMyProfile = !id || id === userData?._id;
  const profileUser = isMyProfile ? userData : passedUser;

  const [tab, setTab] = useState("posts");

  const { data: posts = [], isLoading } = useUserPosts(
    isMyProfile ? userData?._id : id,
  );

  const getAge = (dob) => {
    if (!dob) return "-";
    const birth = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birth.getFullYear();
    if (
      today.getMonth() < birth.getMonth() ||
      (today.getMonth() === birth.getMonth() &&
        today.getDate() < birth.getDate())
    ) {
      age--;
    }
    return age;
  };

  if (!profileUser) {
    return (
      <p
        className={`text-center mt-10 ${
          theme === "dark" ? "text-gray-400" : "text-gray-500"
        }`}
      >
        User data not available 👀
      </p>
    );
  }

  const pageBg =
    theme === "dark" ? "bg-[#0F0F14] text-[#EDEDF0]" : "bg-transparent";

  const cardBg =
    theme === "dark"
      ? "bg-[#16161D] border border-[#2F2F45]"
      : "bg-white shadow";

  const mutedText = theme === "dark" ? "text-gray-400" : "text-gray-600";

  const accentText = theme === "dark" ? "text-[#7C3AED]" : "text-[#35037F]";

  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Moody</title>
        <link rel="icon" href="/bird.svg" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Helmet>
      <div className={`w-full p-4 transition-colors ${pageBg}`}>
        <div className={`rounded-xl  ${cardBg}`}>
          <div className="flex justify-between rounded-t-xl bg-[#6F4BA5] h-10">
            <h1 className="ms-2 text-[#F5D98C] flex items-center font-bold">
              Profile
            </h1>
            <Link
              to="/Home"
              className={`flex items-center gap-2 me-2 text-[#F5D98C] `}
            >
              <span className="font-bold">Home</span>
              <i className="fa-solid fa-house font-bold" />
            </Link>
          </div>
          <div className="p-5">
            <div className="flex flex-col sm:flex-row gap-4 items-center sm:items-start">
              <div
                onClick={() => setIsOpen(true)}
                className="w-24 h-24 rounded-full overflow-hidden border-4 border-[#f2d58f] flex-shrink-0"
              >
                <img
                  src={
                    profileUser?.photo?.includes("default")
                      ? userImage
                      : profileUser?.photo
                  }
                  className="block w-full h-full object-cover"
                  alt={profileUser?.name || "profile"}
                />
              </div>

              <div className="text-center sm:text-left">
                <h2 className={`text-xl font-semibold hover:text-[#7C3AED]`}>
                  {profileUser?.name}
                </h2>
                <p className={`${mutedText} hover:text-[#7C3AED]`}>
                  {profileUser?.email}
                </p>
                <div
                  className={`mt-3 text-sm px-2 py-1 rounded-full w-fit mx-auto sm:mx-0 ${
                    theme === "dark" ? "bg-[#1C1C26]" : "bg-gray-200"
                  }`}
                >
                  {getAge(profileUser?.dateOfBirth)} years old
                  {profileUser?.gender == "male" ? (
                    <i className="fa-solid fa-mars ms-2"></i>
                  ) : (
                    <i className="fa-solid fa-venus ms-2"></i>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          className={`mt-6 ms-2 border-b flex gap-6 text-sm ${
            theme === "dark"
              ? "border-[#2F2F45] text-gray-400"
              : "border-gray-200 text-gray-600"
          }`}
        >
          <button
            onClick={() => setTab("posts")}
            className={`pb-2 transition ${
              tab === "posts"
                ? `${accentText} font-semibold`
                : "hover:text-[#7C3AED]"
            }`}
          >
            Posts
          </button>

          <button
            onClick={() => setTab("about")}
            className={`pb-2 transition ${
              tab === "about"
                ? `${accentText} font-semibold`
                : "hover:text-[#7C3AED]"
            }`}
          >
            About
          </button>
        </div>
        {tab === "posts" && (
          <>
            {isLoading ? (
              <LoadingPage />
            ) : posts.length > 0 ? (
              posts.map((post) => (
                <Post key={post._id} post={post} allcomment={false} />
              ))
            ) : (
              <p
                className={`text-center mt-5 ${
                  theme === "dark" ? "text-gray-400" : "text-gray-500"
                }`}
              >
                No posts yet 👀
              </p>
            )}
          </>
        )}
        {tab === "about" && (
          <div className={`mt-5 rounded-xl p-5 space-y-4 ${cardBg}`}>
            <div>
              <p className={`${mutedText} text-sm`}>Email</p>
              <p>{profileUser?.email}</p>
            </div>
            <div>
              <p className={`${mutedText} text-sm`}>Gender</p>
              <p>{profileUser?.gender}</p>
            </div>
            <div>
              <p className={`${mutedText} text-sm`}>Date of Birth</p>
              <p>{profileUser?.dateOfBirth?.split("T")[0]}</p>
            </div>
          </div>
        )}
      </div>
      <Modal
        placement={"center"}
        isOpen={isOpen}
        onOpenChange={setIsOpen}
        backdrop="blur"
        classNames={{
          backdrop:
            theme === "dark"
              ? "bg-black/60 backdrop-blur-md"
              : "bg-black/40 backdrop-blur-md",
        }}
      >
        <ModalContent
          className={`rounded-2xl p-4 ${
            theme === "dark"
              ? "bg-[#16161D] text-[#EDEDF0]"
              : "bg-white text-gray-800"
          }`}
        >
          <ModalBody className="flex flex-col items-center gap-4">
            <div className="w-48 h-48 rounded-full overflow-hidden border-4 border-[#7C3AED]">
              <img
                src={
                  profileUser?.photo?.includes("default")
                    ? userImage
                    : profileUser?.photo
                }
                className="w-full h-full object-cover"
                alt="profile"
              />
            </div>
            <button
              onClick={() => {
                setIsOpen(false);
                navigate("/Setting");
              }}
              className="mt-2 px-5 py-2 rounded-full font-semibold transition
        bg-[#7C3AED] text-white hover:bg-[#6B21A8]"
            >
              Change your profile photo
            </button>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
