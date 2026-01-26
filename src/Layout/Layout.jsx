import React, { useState, useEffect } from "react";
import Navebar from "../components/Navebar/Navebar";
import { Outlet } from "react-router-dom";
import LeftSidebar from "../components/LeftSidebar/LeftSidebar";
import RightSidebar from "../components/RightSidebar/RightSidebar";
import { useSwipeable } from "react-swipeable";
import { useTheme } from "../Context/themeContext";

export default function Layout() {
  const { theme } = useTheme();

  const [openLeft, setOpenLeft] = useState(false);
  const [openRight, setOpenRight] = useState(false);
  const EDGE_SIZE = 150;

  const handlers = useSwipeable({
    onSwipedRight: (eventData) => {
      const startX = eventData.initial[0];

      if (openRight) {
        setOpenRight(false);
        return;
      }

      if (!openLeft && startX <= EDGE_SIZE) {
        setOpenLeft(true);
      }
    },

    onSwipedLeft: (eventData) => {
      const startX = eventData.initial[0];
      const screenWidth = window.innerWidth;

      if (openLeft) {
        setOpenLeft(false);
        return;
      }

      if (!openRight && startX >= screenWidth - EDGE_SIZE) {
        setOpenRight(true);
      }
    },

    trackTouch: true,
    preventScrollOnSwipe: true,
  });

  useEffect(() => {
    if (openLeft || openRight) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [openLeft, openRight]);

  const drawerBg =
    theme === "dark"
      ? "bg-[#16161D] text-[#EDEDF0]"
      : "bg-[#714EA5] text-white";

  const pageBg = theme === "dark" ? "bg-[#0F0F14]" : "bg-gray-50";

  return (
    <>
      <Navebar />
      <div className={`hidden lg:block mt-16 ${pageBg}`}>
        <LeftSidebar />
        <div className="lg:ml-[22rem] lg:mr-[22rem] lg:flex lg:justify-center">
          <div className="w-full max-w-[1100px] px-4">
            <Outlet />
          </div>
        </div>
        <RightSidebar />
      </div>
      <div
        {...handlers}
        className={`lg:hidden relative overflow-hidden mt-14 ${pageBg}`}
      >
        <div
          className={`fixed top-0 left-0 h-full w-[80vw] max-w-[320px] transition-transform duration-300 z-40 ${
            openLeft ? "translate-x-0" : "-translate-x-[120%]"
          } ${drawerBg}`}
        >
          <div className="h-full overflow-y-auto px-2">
            <LeftSidebar onItemClick={() => setOpenLeft(false)} />
          </div>
        </div>

        <div
          className={`fixed top-0 right-0 h-full w-[80vw] max-w-[320px] transition-transform duration-300 z-40 ${
            openRight ? "translate-x-0" : "translate-x-[120%]"
          } ${drawerBg}`}
        >
          <div className="h-full overflow-y-auto px-2">
            <RightSidebar onItemClick={() => setOpenRight(false)} />
          </div>
        </div>

        {(openLeft || openRight) && (
          <div
            className="fixed inset-0 bg-black/40 z-30"
            onClick={() => {
              setOpenLeft(false);
              setOpenRight(false);
            }}
          />
        )}

        <div className="p-3">
          <Outlet context={{ openLeft, openRight }} />
        </div>
      </div>
    </>
  );
}
