import { useState, useEffect } from "react";
import { usePosts } from "../../Hooks/usePosts";
import { useTheme } from "../../Context/themeContext";
import { Link } from "react-router-dom";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
} from "@heroui/react";

export default function RightSidebar({ onItemClick }) {
  const { theme } = useTheme();
  const { posts } = usePosts();

  const [isOpen, setIsOpen] = useState(false);
  const [gameUrl, setGameUrl] = useState("");

  /* ===== Prevent background scroll ===== */
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
  }, [isOpen]);

  const trending = [...posts]
    .sort((a, b) => (b?.comments?.length || 0) - (a?.comments?.length || 0))
    .slice(0, 3);

  const game = {
    title: "🐍 Snake",
    link: "https://snak.ee/",
  };

  /* ===== COLORS ===== */
  const wrapperClasses =
    theme === "dark"
      ? "bg-[#16161D] text-[#EDEDF0]"
      : "bg-[#714EA5] text-white";

  const accentText =
    theme === "dark" ? "text-[#7C3AED]" : "text-[#F5D98C]";

  const cardBg =
    theme === "dark" ? "bg-[#1C1C26]" : "bg-white/10";

  const hoverBg =
    theme === "dark" ? "hover:bg-[#2A2A3A]" : "hover:bg-white/20";

  const mutedText =
    theme === "dark" ? "text-gray-400" : "text-[#F5D98C]";

  const divider =
    theme === "dark" ? "border-[#2F2F45]" : "border-white/30";

  const modalBg =
    theme === "dark"
      ? "bg-[#16161D] text-[#EDEDF0]"
      : "bg-[#714EA5] text-white";

  return (
    <>
      <aside className="fixed right-0 top-0 w-full lg:w-80 lg:bottom-0 lg:right-0 lg:top-15">
        <div
          className={`
            h-full
            overflow-y-auto
            p-5
            space-y-7
            transition-colors
            no-scrollbar
            ${wrapperClasses}
          `}
        >
          {/* ===== Trending ===== */}
          <div>
            <h2
              className={`text-lg font-bold mb-3 flex items-center gap-2 ${accentText}`}
            >
              <i className="fa-solid fa-fire" /> Trending Now
            </h2>

            {trending.length ? (
              trending.map((post, i) => (
                <Link
                  key={i}
                  to={`/SinglePost/${post.id}`}
                  onClick={onItemClick}   
                  className="block"
                >
                  <div
                    className={`mb-2 p-2 rounded-lg transition cursor-pointer ${cardBg} ${hoverBg}`}
                  >
                    <p className="text-sm">
                      {post?.body?.slice(0, 40) || "Post"}
                    </p>
                    <span className={`text-xs ${mutedText}`}>
                      {post?.comments?.length || 0} comments
                    </span>
                  </div>
                </Link>
              ))
            ) : (
              <p className={`text-sm ${mutedText}`}>No trending yet</p>
            )}
          </div>

          <hr className={divider} />

          {/* ===== Play Zone ===== */}
          <div>
            <h2
              className={`text-lg font-bold mb-4 flex items-center gap-2 ${accentText}`}
            >
              <i className="fa-solid fa-gamepad" /> Play Zone
            </h2>

            <button
              onClick={() => {
                setGameUrl(game.link);
                setIsOpen(true);
                onItemClick?.(); // 👈 يقفل في الموبايل بس
              }}
              className={`w-full text-left mb-3 rounded-lg p-2 text-sm transition ${cardBg} ${hoverBg}`}
            >
              {game.title}
            </button>

            <div
              className={`
                mt-2
                rounded-lg
                p-3
                text-sm
                text-center
                border
                border-dashed
                ${
                  theme === "dark"
                    ? "border-[#2F2F45] text-gray-400"
                    : "border-white/40 text-[#F5D98C]"
                }
              `}
            >
              🎮 More games coming soon…
            </div>
          </div>
        </div>
      </aside>

      {/* ===== Game Modal ===== */}
      <Modal
        isOpen={isOpen}
        placement="center"
        backdrop="blur"
        size="5xl"
        onOpenChange={(open) => {
          setIsOpen(open);
          if (!open) setGameUrl("");
        }}
        classNames={{ backdrop: "backdrop-blur-md" }}
      >
        <ModalContent
          className={`
            rounded-xl
            overflow-hidden
            ${modalBg}
            h-[80vh]
            lg:h-[90vh]
          `}
        >
          <ModalHeader>🎮 Snake</ModalHeader>

          <ModalBody className="p-0 h-full">
            <iframe
              src={gameUrl}
              title="Snake Game"
              loading="lazy"
              className="w-full h-full border-none"
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
}
