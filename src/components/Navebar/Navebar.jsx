import {
  Navbar as HeroNav,
  NavbarBrand,
  NavbarContent,
  DropdownItem,
  DropdownTrigger,
  Dropdown,
  DropdownMenu,
  Avatar,
} from "@heroui/react";
import { useContext, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../../Context/authContext";
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
import toast from "react-hot-toast";
import { useTheme } from "../../Context/themeContext";

export default function Navbar() {
  const { theme } = useTheme();
  const location = useLocation();
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const navigate = useNavigate();
  const { setusertoken, userData } = useContext(AuthContext);

  function logout() {
    localStorage.removeItem("token");
    setusertoken(null);
    toast("See you soon 👋");
    navigate("/");
  }

  function isActive(path) {
    return location.pathname.startsWith(path);
  }

  const navBg =
    theme === "dark"
      ? "bg-[#16161D]/80 backdrop-blur-md"
      : "bg-[#35037F]/75";

  const brandText =
    theme === "dark" ? "text-[#EDEDF0]" : "text-[#F5D98C]";

  const dropdownBg =
    theme === "dark" ? "bg-[#16161D] text-white" : "bg-white text-black";

  return (
    <>
      <HeroNav
        className={`fixed top-0 ${navBg}`}
        classNames={{ wrapper: "w-full max-w-none px-6" }}
      >
        <NavbarBrand className="ms-0 md:ms-20">
          <Link to="/Home" className="flex items-center gap-2">
            <img src="/bird.png" className="w-1/4 md:w-1/8" />
            <h2
              className={`text-3xl font-semibold ${brandText}`}
              style={{ fontFamily: "Montserrat, sans-serif" }}
            >
              Moody
            </h2>
          </Link>
        </NavbarBrand>

        <NavbarContent as="div" justify="end" className="me-0 md:me-20">
          <Dropdown placement="bottom-end">
            <DropdownTrigger>
              <Avatar
                isBordered
                as="button"
                className="transition-transform"
                color="warning"
                size="sm"
                src={
                  userData?.photo?.includes("default")
                    ? userImage
                    : userData?.photo
                }
              />
            </DropdownTrigger>

            <DropdownMenu
              aria-label="Profile Actions"
              variant="flat"
              className={dropdownBg}
            >
              <DropdownItem key="profile" className="h-14 gap-2">
                <p className="font-semibold">Signed in as</p>
                <p className="font-semibold">{userData?.email}</p>
              </DropdownItem>

              <DropdownItem
                key="Profile"
                onPress={() => navigate("/Profile")}
                className={`group ${
                  isActive("/Profile")
                    ? "border-b-[5px] border-[#f2d58f]"
                    : ""
                }`}
              >
                <span className="relative block">
                  <i
                    className="me-1 fa-solid fa-user fa-sm"
                    style={{ color: "#f2d58f" }}
                  ></i>
                  Profile
                </span>
              </DropdownItem>

              <DropdownItem
                key="Setting"
                onPress={() => navigate("/Setting")}
                className={`group ${
                  isActive("/Setting")
                    ? "border-b-[5px] border-[#f2d58f]"
                    : ""
                }`}
              >
                <span className="relative block">
                  <i
                    className="me-1 fa-solid fa-gear fa-sm"
                    style={{ color: "#f2d58f" }}
                  ></i>
                  Setting
                </span>
              </DropdownItem>

              <DropdownItem key="logout" color="danger" onPress={onOpen}>
                <i className="fa-solid fa-right-from-bracket fa-sm"></i>
                Log Out
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </NavbarContent>
      </HeroNav>

      <Modal
        backdrop="blur"
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        placement="center"
      >
        <ModalContent
          className={theme === "dark" ? "bg-[#16161D] text-white" : ""}
        >
          {(onClose) => (
            <>
              <ModalHeader className="flex gap-2 items-center">
                <i className="fa-solid fa-triangle-exclamation text-red-500"></i>
                Confirm Logout
              </ModalHeader>
              <ModalBody>
                <p className="text-center text-lg">
                  Are you sure you want to log out?
                </p>
              </ModalBody>
              <ModalFooter className="flex justify-center gap-4">
                <Button variant="light" onPress={onClose}>
                  Cancel
                </Button>
                <Button
                  color="danger"
                  onPress={() => {
                    logout();
                    onClose();
                  }}
                >
                  Yes, Log Out
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
