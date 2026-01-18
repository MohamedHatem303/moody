  import userImage from "../../assets/userImage.png";
  import { usePosts } from "../../Hooks/usePosts";
  import { useTheme } from "../../Context/themeContext";

  export default function LeftSidebar() {
    const { theme } = useTheme();
    const { posts } = usePosts();

    const today = new Date().toDateString();

    const todaysPosts = posts.filter(
      (p) => new Date(p?.createdAt).toDateString() === today
    );

    const todaysComments = todaysPosts.reduce(
      (acc, p) => acc + (p?.comments?.length || 0),
      0
    );

    let mostActivePost = null;
    if (posts.length) {
      mostActivePost = [...posts].sort(
        (a, b) => (b?.comments?.length || 0) - (a?.comments?.length || 0)
      )[0];
    }

    const userMap = {};
    posts.forEach((p) => {
      const id = p?.user?._id;
      if (!id) return;

      if (!userMap[id]) {
        userMap[id] = {
          name: p?.user?.name || "Unknown",
          photo: p?.user?.photo,
          count: 0,
        };
      }
      userMap[id].count++;
    });

    const topVoices = Object.values(userMap)
      .sort((a, b) => b.count - a.count)
      .slice(0, 3);

    /* ================= COLORS ================= */

    // Light زي RightSidebar
    const lightWrapper = "bg-[#714EA5] text-white border-gray-200";
    const lightAccent = "text-[#F5D98C]";
    const lightCard = "bg-white/10";
    const lightHover = "hover:bg-white/20";

    // Dark (زي ما كان)
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
            rounded-xl
            lg:shadow-sm
            p-4
            space-y-4
            h-full
            overflow-y-auto
            transition-colors
            ${wrapper}
          `}
        >
          {/* Logo */}
          <div className="flex flex-col items-center">
            <img src="/bird.png" className="w-17 h-17" />
            <h2 className={`text-3xl font-semibold ${accent}`}>
              Moody
            </h2>
            <p className={`text-sm mt-1 ${accent}`}>
              Community Insights
            </p>
          </div>

          <hr className={divider} />

          {/* Snapshot */}
          <div>
            <h2 className={`text-lg font-bold flex items-center gap-2 mb-2 ${accent}`}>
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

            <p>
              Top Post:
              <b className={`ms-1 ${accent}`}>
                {mostActivePost?.body
                  ? mostActivePost.body.slice(0, 35) +
                    (mostActivePost.body.length > 35 ? "..." : "")
                  : "No posts yet"}
              </b>
            </p>
          </div>

          <hr className={divider} />

          {/* Top Voices */}
          <div>
            <h2 className={`text-lg font-bold flex items-center gap-2 mb-1 ${accent}`}>
              <i className="fa-solid fa-user-astronaut" />
              Top Voices
            </h2>

            {topVoices.length > 0 ? (
              topVoices.map((u, i) => (
                <div
                  key={i}
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
                      <p className={`text-xs ${accent}`}>
                        {u.count} posts
                      </p>
                    </div>
                  </div>
                  <i className={`fa-solid fa-crown ${accent}`}></i>
                </div>
              ))
            ) : (
              <p className={`text-sm ${accent}`}>No data</p>
            )}
          </div>
        </div>
      </aside>
    );
  }
