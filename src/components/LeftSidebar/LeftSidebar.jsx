import userImage from "../../assets/userImage.png";
import { usePosts } from "../../Hooks/usePosts";
import { useTheme } from "../../Context/themeContext";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";

export default function LeftSidebar({ onItemClick }) {
  const { theme } = useTheme();
  const { posts } = usePosts();

  const today = new Date().toDateString();

  const todaysPosts = posts.filter(
    (p) => new Date(p?.createdAt).toDateString() === today,
  );

  const todaysComments = todaysPosts.reduce(
    (acc, p) => acc + (p?.comments?.length || 0),
    0,
  );

  let mostActivePost = null;
  if (posts.length) {
    mostActivePost = [...posts].sort(
      (a, b) => (b?.comments?.length || 0) - (a?.comments?.length || 0),
    )[0];
  }

  const userMap = {};
  posts.forEach((p) => {
    const id = p?.user?._id;
    if (!id) return;

    if (!userMap[id]) {
      userMap[id] = {
        id,
        user: p.user,
        name: p.user.name || "Unknown",
        photo: p.user.photo,
        count: 0,
      };
    }
    userMap[id].count++;
  });

  const topVoices = Object.values(userMap)
    .sort((a, b) => b.count - a.count)
    .slice(0, 3);

  const lightWrapper = "bg-[#714EA5] text-white border-gray-200";
  const lightAccent = "text-[#F5D98C]";
  const lightCard = "bg-white/10";
  const lightHover = "hover:bg-white/20";

  const darkWrapper = "bg-[#16161D] text-[#EDEDF0] border-[#2F2F45]";
  const darkAccent = "text-[#7C3AED]";
  const darkCard = "bg-[#1C1C26]";
  const darkHover = "hover:bg-[#2A2A3A]";

  const wrapper = theme === "dark" ? darkWrapper : lightWrapper;
  const accent = theme === "dark" ? darkAccent : lightAccent;
  const card = theme === "dark" ? darkCard : lightCard;
  const hover = theme === "dark" ? darkHover : lightHover;
  const divider =
    theme === "dark" ? "border-[#2F2F45]" : "border-gray-300 opacity-40";
  function love() {
    toast("Thank you for visiting Moody❤️");
    onItemClick();
  }

  return (
    <aside
      className="
        fixed
        left-0
        top-0
        w-full
        lg:top-15
        lg:bottom-0
        lg:left-0
        lg:w-80
      "
    >
      <div
        className={`
          p-4
          space-y-4
          h-full
          overflow-y-auto
          transition-colors
          no-scrollbar
          ${wrapper}
        `}
      >
        <Link to="/Home" onClick={onItemClick}>
          <div className="flex flex-col items-center">
            <img src="/bird.png" className="w-17 h-17" />
            <h2 className={`text-3xl font-semibold ${accent}`}>Moody</h2>
          </div>
        </Link>
        <hr className={divider} />

        <div>
          <h2
            className={`text-lg font-bold flex items-center gap-2 mb-2 ${accent}`}
          >
            <i className="fa-solid fa-chart-line" />
            Community Snapshot
          </h2>

          <p>
            Posts Today:
            <b className={`ms-1 ${accent}`}>{todaysPosts.length}</b>
          </p>

          <p>
            Comments Today:
            <b className={`ms-1 ${accent}`}>{todaysComments}</b>
          </p>
        </div>

        <hr className={divider} />

        <div>
          <h2
            className={`text-lg font-bold flex items-center gap-2 mb-1 ${accent}`}
          >
            <i className="fa-solid fa-user-astronaut" />
            Top Voices
          </h2>

          {topVoices.length ? (
            topVoices.map((u, i) => (
              <Link
                key={i}
                to={`/UserProfile/${u.id}`}
                state={{ user: u.user }}
                onClick={onItemClick}
                className="block"
              >
                <div
                  className={`flex items-center justify-between mb-2 p-2 rounded-lg transition ${card} ${hover}`}
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={
                        !u.photo || u.photo?.includes("default")
                          ? userImage
                          : u.photo
                      }
                      className="w-9 h-9 rounded-full border border-gray-200 object-cover"
                    />
                    <div>
                      <p className="text-sm">{u.name}</p>
                      <p className={`text-xs ${accent}`}>{u.count} posts</p>
                    </div>
                  </div>

                  <i className={`fa-solid fa-crown ${accent}`}></i>
                </div>
              </Link>
            ))
          ) : (
            <p className={`text-sm ${accent}`}>No data</p>
          )}
        </div>
        <footer className="hidden lg:block text-[#FFf  ] py-6 relative -bottom-38 lg:bottom-0 w-full">
          <div className="container mx-auto text-center space-y-5">
            <div className="flex justify-center gap-5 text-xl icons">
              <a
                onClick={onItemClick}
                target="_blank"
                href="https://www.facebook.com/share/1GgLvCTiJS/"
                className="hover:text-blue-500 transition"
              >
                <i className="fa-brands fa-facebook" />
              </a>
              <a
                onClick={onItemClick}
                target="_blank"
                href="https://www.instagram.com/mohamed_hatem.303"
                className="hover:text-pink-500 transition"
              >
                <i className="fa-brands fa-instagram" />
              </a>
              <a
                onClick={onItemClick}
                target="_blank"
                href="https://wa.me/qr/XANON7AKNBE6F1"
                className="hover:text-green-500 transition"
              >
                <i className="fa-brands fa-whatsapp" />
              </a>
              <a
                onClick={onItemClick}
                target="_blank"
                href="https://www.snapchat.com/add/mohamed3hatem"
                className="hover:text-yellow-400 transition"
              >
                <i className="fa-brands fa-snapchat" />
              </a>
              <a
                href="https://mail.google.com/mail/?view=cm&fs=1&to=mohamedhatm303@gmail.com"
                target="_blank"
                rel="noopener noreferrer"
                className="hover:text-red-400 transition"
              >
                <i className="fa-solid fa-envelope" />
              </a>
            </div>
            <p className="text-sm mb-0">Designed &amp; Developed by Eng</p>
            <span onClick={love} className="text-[#F5D98C] font-semibold">
              Mohamed Hatem
            </span>
          </div>
        </footer>
      </div>
      <footer className=" lg:hidden text-[#FFf  ] py-6 relative -bottom-28 lg:bottom-0 w-full">
        <div className="container mx-auto text-center space-y-5">
          <div className="flex justify-center gap-5 text-xl icons">
            <a
              onClick={onItemClick}
              target="_blank"
              href="https://www.facebook.com/share/1GgLvCTiJS/"
              className="hover:text-blue-500 transition"
            >
              <i className="fa-brands fa-facebook" />
            </a>
            <a
              onClick={onItemClick}
              target="_blank"
              href="https://www.instagram.com/mohamed_hatem.303"
              className="hover:text-pink-500 transition"
            >
              <i className="fa-brands fa-instagram" />
            </a>
            <a
              onClick={onItemClick}
              target="_blank"
              href="https://wa.me/qr/XANON7AKNBE6F1"
              className="hover:text-green-500 transition"
            >
              <i className="fa-brands fa-whatsapp" />
            </a>
            <a
              onClick={onItemClick}
              target="_blank"
              href="https://www.snapchat.com/add/mohamed3hatem"
              className="hover:text-yellow-400 transition"
            >
              <i className="fa-brands fa-snapchat" />
            </a>
            <a
              onClick={onItemClick}
              href="mailto:mohamedhatm303@gmail.com"
              className="hover:text-red-400 transition"
            >
              <i className="fa-solid fa-envelope" />
            </a>
          </div>
          <p className="text-sm mb-0">Designed &amp; Developed by Eng</p>
          <span onClick={love} className="text-[#F5D98C] font-semibold">
            Mohamed Hatem
          </span>
        </div>
      </footer>
    </aside>
  );
}