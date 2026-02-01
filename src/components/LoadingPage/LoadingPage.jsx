import React from "react";
import { useTheme } from "../../Context/themeContext";

export default function LoadingPage() {
  const { theme } = useTheme();

  const cardBg =
    theme === "dark"
      ? "bg-[#16161D] border-[#2F2F45]"
      : "bg-white border-gray-200";

  const skeleton = theme === "dark" ? "bg-[#2A2A3A]" : "bg-gray-300";

  const divider = theme === "dark" ? "border-[#2F2F45]" : "border-gray-200";

  return (
    <div
      className={`rounded-2xl shadow-sm w-full min-h-[80vh] mx-auto overflow-hidden my-3 animate-pulse border ${cardBg}`}
    >
      <div className="flex items-center gap-3 p-3">
        <div className={`w-9 h-9 rounded-full ${skeleton}`}></div>
        <div className="flex flex-col gap-1">
          <div className={`w-28 h-4 rounded ${skeleton}`}></div>
          <div className={`w-16 h-3 rounded ${skeleton}`}></div>
        </div>
      </div>

      <div
        className={`w-full h-[180px] sm:h-[220px] md:h-[260px] ${skeleton}`}
      ></div>

      <div className="mt-2 px-4 space-y-2">
        <div className={`w-full h-4 rounded ${skeleton}`}></div>
        <div className={`w-2/3 h-4 rounded ${skeleton}`}></div>
      </div>

      <div className="flex justify-between px-4 mt-3">
        <div className={`w-14 h-4 rounded ${skeleton}`}></div>
        <div className={`w-16 h-4 rounded ${skeleton}`}></div>
      </div>

      <hr className={`my-2 ${divider}`} />

      <div className="flex justify-between px-6 pb-2">
        <div className={`w-16 h-5 rounded ${skeleton}`}></div>
        <div className={`w-20 h-5 rounded ${skeleton}`}></div>
        <div className={`w-16 h-5 rounded ${skeleton}`}></div>
      </div>

      <hr className={`my-2 ${divider}`} />

      <div className="mt-1 mx-4 flex items-center gap-3">
        <div className={`w-8 h-8 rounded-full ${skeleton}`}></div>
        <div>
          <div className={`w-20 h-4 rounded mb-1 ${skeleton}`}></div>
          <div className={`w-32 h-4 rounded ${skeleton}`}></div>
        </div>
      </div>

      <div className="mt-2 mb-3 px-4">
        <div className={`w-24 h-4 rounded ${skeleton}`}></div>
      </div>
    </div>
  );
}
