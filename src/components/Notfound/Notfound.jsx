import React from "react";
import { useTheme } from "../../Context/themeContext";

export default function Notfound() {
  const { theme } = useTheme();

  const pageBg =
    theme === "dark" ? "bg-[#0F0F14] text-[#EDEDF0]" : "bg-white text-gray-900";

  const mutedText =
    theme === "dark" ? "text-gray-400" : "text-gray-500";

  return (
    <div
      className={`min-h-screen flex flex-col justify-center items-center transition-colors ${pageBg}`}
    >
      <h1 className="text-6xl font-bold mb-4 text-[#7C3AED]">
        404
      </h1>
      <p className={`text-lg ${mutedText}`}>
        Page not found
      </p>
    </div>
  );
}
