import React, { useContext, useRef, useState } from "react";
import { Button } from "@heroui/react";
import { AuthContext } from "../../Context/authContext";
import userImage from "../../assets/userImage.png";
import { uploadProfilePhoto } from "../../Server/UploadProfilePhotoApi/UploadProfilePhotoApi";
import { useQueryClient } from "@tanstack/react-query";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  useDisclosure,
} from "@heroui/react";
import { changePassword } from "../../Server/ChangePasswordApi/ChangePasswordApi";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff } from "lucide-react";
import { useTheme } from "../../Context/themeContext";
import { Helmet } from "react-helmet";

export default function Setting() {
  const { theme, toggleTheme } = useTheme();

  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const navigate = useNavigate();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loadingPassword, setLoadingPassword] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState(null);
  const { userData, refetchUser } = useContext(AuthContext);
  const queryClient = useQueryClient();
  const [previewUrl, setPreviewUrl] = useState(userData?.photo || "");
  const [file, setFile] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const fileInputRef = useRef(null);

  function handleChooseClick() {
    if (fileInputRef.current) fileInputRef.current.value = null;
    fileInputRef.current?.click();
  }

  function handleSelect(e) {
    const f = e.target.files?.[0];
    if (!f) return;

    const MAX_MB = 8;
    if (f.size > MAX_MB * 1024 * 1024) {
      setMessage(`Image is too large. Max ${MAX_MB} MB.`);
      if (fileInputRef.current) fileInputRef.current.value = null;
      return;
    }

    setFile(f);
    setMessage(null);

    const reader = new FileReader();
    reader.onload = (ev) => setPreviewUrl(ev.target.result);
    reader.readAsDataURL(f);
  }

  async function handleSave(e) {
    e.preventDefault();
    if (!file) return;

    setIsSaving(true);
    setMessage(null);

    try {
      const formData = new FormData();
      formData.append("photo", file);

      const res = await uploadProfilePhoto(formData);

      if (res?.message === "success") {
        await refetchUser();
        queryClient.invalidateQueries(["posts"]);
        queryClient.invalidateQueries(["user-posts"]);
        toast.success("Profile photo updated successfully");
      }

      setFile(null);
      if (fileInputRef.current) fileInputRef.current.value = null;
    } catch {
      toast.error("Failed to upload photo");
    } finally {
      setIsSaving(false);
    }
  }

  async function handleChangePassword(e) {
    e.preventDefault();
    setLoadingPassword(true);
    setPasswordMessage(null);

    try {
      const res = await changePassword({
        password: oldPassword,
        newPassword,
      });

      if (res?.message === "success") {
        toast.success("Password changed. Please log in again 🔐");
        localStorage.removeItem("token");
        navigate("/", { replace: true });
        setOldPassword("");
        setNewPassword("");
      }
    } catch (err) {
      setPasswordMessage(
        err?.response?.data?.error || "Failed to change password"
      );
    } finally {
      setLoadingPassword(false);
    }
  }

  const pageClasses =
    theme === "dark"
      ? "bg-[#0F0F14] text-[#EDEDF0]"
      : "bg-gray-50 text-gray-900";

  const cardClasses =
    theme === "dark"
      ? "bg-[#16161D] border-[#2F2F45]"
      : "bg-white border-gray-200";

  const headerClasses =
    theme === "dark" ? "bg-[#1C1C26]" : "bg-[#714EA5]";

  const headerText =
    theme === "dark" ? "text-[#EDEDF0]" : "text-[#F5D98C]";

  const accentText =
    theme === "dark" ? "text-[#7C3AED]" : "text-[#35037F]";
  return (
    <>
    <Helmet>
      <meta charSet="utf-8" />
      <title>Moody</title>
      <link rel="icon" href="/favicon.ico" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />  
    </Helmet>
    <div className={`mt-6 p-4 transition-colors ${pageClasses}`}>
      <div className="w-full">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold mb-3 text-[#7C3AED]">
              Settings
            </h1>
          </div>
          <div>
            <Link
              to="/Home"
              className={`flex items-center gap-2 mb-3 text-[#7C3AED]`}
            >
              <h1 className="text-xl font-semibold">Home</h1>
              <i className="fa-solid fa-arrow-right fa-lg" />
            </Link>
          </div>
        </div>

        {/* Change Profile Photo */}
        <div className={`rounded-xl shadow-sm border overflow-hidden mb-6 ${cardClasses}`}>
          <div className={`p-5 ${headerClasses}`}>
            <h2 className={`text-lg font-bold ${headerText}`}>
              Change Profile Photo
            </h2>
          </div>

          <form
            onSubmit={handleSave}
            className="p-6 flex flex-col items-center gap-5"
          >
            <img
              src={
                previewUrl
                  ? previewUrl
                  : userData?.photo?.includes("default")
                  ? userImage
                  : userData?.photo
              }
              className="w-32 h-32 rounded-full border-4 border-[#7C3AED] object-cover shadow"
              alt="profile preview"
            />

            <div className="flex gap-4">
              <button
                type="button"
                onClick={handleChooseClick}
                className={`px-5 py-2 rounded-xl transition ${
                  theme === "dark"
                    ? "bg-[#714EA5] text-[#F5D98C]"
                    : "bg-[#714EA5] text-[#F5D98C]"
                }`}
              >
                Choose Photo
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleSelect}
                className="hidden"
              />

              <button
                disabled={!file || isSaving}
                type="submit"
                className={`px-5 py-2 rounded-xl transition ${
                  file
                    ? "bg-[#7C3AED] text-white hover:scale-105"
                    : "bg-[#2A2A3A] text-white cursor-not-allowed"
                }`}
              >
                {isSaving ? "Saving..." : "Save Changes"}
              </button>
            </div>

            <p className="text-sm opacity-70">
              Profile photos help others recognize you
            </p>

            {message && <p className="text-sm opacity-70">{message}</p>}
          </form>
        </div>

        {/* Change Password */}
        <div className={`rounded-xl shadow-sm border overflow-hidden mb-6 ${cardClasses}`}>
          <div className={`p-5 ${headerClasses}`}>
            <h2 className={`text-lg font-bold ${headerText}`}>
              Change Password
            </h2>
          </div>

          <div className="p-5 flex justify-between items-center">
            <span className="opacity-70">Password Settings</span>
            <button
              onClick={onOpen}
              className="px-4 py-2 rounded-xl bg-[#714EA5] text-[#F5D98C] hover:scale-105 transition"
            >
              Change Password
            </button>
          </div>
        </div>

        <Modal isOpen={isOpen} onOpenChange={onOpenChange} backdrop="blur">
          <ModalContent className={theme === "dark" ? "bg-[#16161D] text-white" : ""}>
            {(onClose) => (
              <>
                <ModalHeader className="text-[#7C3AED]">
                  Change Password
                </ModalHeader>

                <form onSubmit={handleChangePassword}>
                  <ModalBody className="gap-4">
                    <Input
                      type={showOldPassword ? "text" : "password"}
                      label="Current Password"
                      value={oldPassword}
                      onChange={(e) => setOldPassword(e.target.value)}
                      required
                    />
                    <Input
                      type={showNewPassword ? "text" : "password"}
                      label="New Password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                    />
                    {passwordMessage && (
                      <p className="text-sm text-center opacity-70">
                        {passwordMessage}
                      </p>
                    )}
                  </ModalBody>

                  <ModalFooter>
                    <Button variant="light" onPress={onClose}>
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      isDisabled={loadingPassword}
                      className="bg-[#7C3AED] text-white"
                    >
                      {loadingPassword ? "Saving..." : "Save"}
                    </Button>
                  </ModalFooter>
                </form>
              </>
            )}
          </ModalContent>
        </Modal>

        {/* Dark Mode */}
        <div className={`rounded-xl shadow-sm border overflow-hidden mb-6 ${cardClasses}`}>
          <div className={`p-5 ${headerClasses}`}>
            <h2 className={`text-lg font-bold ${headerText}`}>
              Dark Mode
            </h2>
          </div>

          <div className="p-5 flex justify-between items-center">
            <span className="opacity-70">Enable Dark Mode</span>

            <label className="relative inline-flex cursor-pointer items-center">
              <input
                type="checkbox"
                checked={theme === "dark"}
                onChange={toggleTheme}
                className="peer sr-only"
              />
              <div className="w-12 h-6 rounded-full bg-gray-300 peer-checked:bg-[#7C3AED] transition" />
              <span className="absolute left-1 top-[3px] w-5 h-5 bg-white rounded-full transition peer-checked:translate-x-6" />
            </label>
          </div>
        </div>
      </div>
    </div>
    </>
  );
}
