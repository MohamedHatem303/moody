import { usePosts } from "../../Hooks/usePosts";
import { useTheme } from "../../Context/themeContext";

export default function RightSidebar() {
  const { theme } = useTheme();
  const { posts } = usePosts();

  const trending = [...posts]
    .sort((a, b) => (b?.comments?.length || 0) - (a?.comments?.length || 0))
    .slice(0, 3);

  const games = [
    { title: "🐍 Google Snake", link: "https://snak.ee/" },
    { title: "🦖 Dino Runner", link: "https://offline-dino-game.firebaseapp.com/" },
    { title: "❌ Tic-Tac-Toe", link: "https://playtictactoe.org/" },
  ];

  const wrapperClasses =
    theme === "dark"
      ? "bg-[#16161D] text-[#EDEDF0] border-[#2F2F45]"
      : "bg-[#714EA5] text-white border-gray-200";

  const accentText =
    theme === "dark" ? "text-[#7C3AED]" : "text-[#F5D98C]";

  const cardBg =
    theme === "dark" ? "bg-[#1C1C26]" : "bg-white/10";

  const hoverBg =
    theme === "dark" ? "hover:bg-[#2A2A3A]" : "hover:bg-white/20";

  const mutedText =
    theme === "dark" ? "text-gray-400" : "text-[#F5D98C]";

  const divider =
    theme === "dark" ? "border-[#2F2F45]" : "border-gray-300 opacity-50";

  return (
    <aside
      className="
        fixed
        right-0
        top-0
        w-full
        lg:top-15
        lg:bottom-0
        lg:right-0
        lg:w-80
      "
    >
      <div
        className={`
          rounded-xl
          p-5
          lg:shadow-sm
          space-y-7
          h-full
          overflow-y-auto
          transition-colors
          ${wrapperClasses}
        `}
      >
        <div>
          <h2 className={`text-lg font-bold mb-3 flex items-center gap-2 ${accentText}`}>
            <i className="fa-solid fa-fire" /> Trending Now
          </h2>

          {trending.length > 0 ? (
            trending.map((p, i) => (
              <div
                key={i}
                className={`mb-2 p-2 rounded-lg transition ${cardBg} ${hoverBg}`}
              >
                <p className="text-sm">
                  {p?.body
                    ? p.body.slice(0, 40) +
                      (p.body.length > 40 ? "..." : "")
                    : "Post"}
                </p>
                <span className={`text-xs ${mutedText}`}>
                  {p?.comments?.length || 0} comments
                </span>
              </div>
            ))
          ) : (
            <p className={`text-sm ${mutedText}`}>No trending yet</p>
          )}
        </div>

        <hr className={divider} />

        <div>
          <h2 className={`text-lg font-bold mb-4 flex items-center gap-2 ${accentText}`}>
            <i className="fa-solid fa-gamepad" /> Play Zone
          </h2>

          {games.map((g, i) => (
            <a
              key={i}
              href={g.link}
              target="_blank"
              rel="noopener noreferrer"
              className={`block mb-3 rounded-lg p-2 text-sm transition ${cardBg} ${hoverBg}`}
            >
              {g.title}
            </a>
          ))}
        </div>
      </div>
    </aside>
  );
}
