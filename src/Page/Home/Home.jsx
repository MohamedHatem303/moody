import { useEffect, useState } from "react";
import { usePosts } from "../../Hooks/usePosts";
import Post from "../../components/Post/Post";
import CreatePost from "../../components/CreatePost/CreatePost";
import LoadingPage from "../../components/LoadingPage/LoadingPage";
import { useTheme } from "../../Context/themeContext";
import { Helmet } from "react-helmet";
import { useOutletContext } from "react-router-dom";

export default function Home() {
  const { theme } = useTheme();

  const outletContext = useOutletContext() || {};
  const { openLeft = false, openRight = false } = outletContext;

  const { posts, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } =
    usePosts();

  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1024);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
    };

    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);

      if (!hasNextPage || isFetchingNextPage) return;

      const scrollTop = window.scrollY;
      const windowHeight = window.innerHeight;
      const fullHeight = document.documentElement.scrollHeight;

      const distanceFromBottom = fullHeight - (scrollTop + windowHeight);

      if (distanceFromBottom <= 7000) {
        fetchNextPage();
      }
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll);
    };
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  if (isLoading) return <LoadingPage />;

  const pageBg =
    theme === "dark" ? "bg-[#0F0F14] text-[#EDEDF0]" : "bg-white text-gray-900";

  const loadingText = theme === "dark" ? "text-gray-400" : "text-gray-600";

  const spinnerBorder =
    theme === "dark" ? "border-gray-600" : "border-gray-400";

  const hideOnMobileSidebar = isMobile && (openLeft || openRight);

  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Moody</title>
        <link rel="icon" href="/bird.svg" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Helmet>

      <div className={`transition-colors  ${pageBg}`}>
        <CreatePost />

        {posts.map((post) => (
          <Post key={post.id} post={post} allcomment={false} />
        ))}

        {isFetchingNextPage && (
          <div
            className={`flex justify-center items-center gap-2 my-6 ${loadingText}`}
          >
            <span
              className={`w-4 h-4 border-2 ${spinnerBorder} border-t-transparent rounded-full animate-spin`}
            ></span>
            <span>Loading</span>
          </div>
        )}
      </div>

      {showScrollTop && !hideOnMobileSidebar && (
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className={`
            fixed bottom-6 right-6 lg:right-[320px] z-50
            w-12 h-12 rounded-full
            flex items-center justify-center
            shadow-lg transition-all duration-300

            outline outline-2 outline-offset-[-6px]

            ${
              theme === "dark"
                ? //#f2d58f
                  "bg-[#0F0F14] text-[#7C3AED] outline-[#7C3AED] hover:text-[#f2d58f] hover:outline-[#f2d58f]"
                : "bg-[#7C3AED] text-[#f2d58f] outline-[#f2d58f] hover:outline-[#7C3AED] hover:text-[#7C3AED] hover:bg-white"
            }
          `}
          aria-label="Scroll to top"
        >
          <i className="fa-solid fa-arrow-up text-lg"></i>
        </button>
      )}
    </>
  );
}
