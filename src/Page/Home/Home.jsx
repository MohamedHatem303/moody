import { useEffect } from "react";
import { usePosts } from "../../Hooks/usePosts";
import Post from "../../components/Post/Post";
import CreatePost from "../../components/CreatePost/CreatePost";
import LoadingPage from "../../components/LoadingPage/LoadingPage";
import { useTheme } from "../../Context/themeContext";
import { Helmet } from "react-helmet";

export default function Home() {
  const { theme } = useTheme();

  const {
    posts,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = usePosts();

  useEffect(() => {
    const handleScroll = () => {
      if (!hasNextPage || isFetchingNextPage) return;

      const scrollPosition = window.innerHeight + window.scrollY;
      const threshold = document.body.offsetHeight - 500;

      if (scrollPosition >= threshold) {
        fetchNextPage();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  if (isLoading) return <LoadingPage />;

  const pageBg =
    theme === "dark" ? "bg-[#0F0F14] text-[#EDEDF0]" : "bg-white text-gray-900";

  const loadingText =
    theme === "dark" ? "text-gray-400" : "text-gray-600";

  const spinnerBorder =
    theme === "dark" ? "border-gray-600" : "border-gray-400";

  return (
    <>
      <Helmet>
        <meta charSet="utf-8" />
        <title>Moody</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />  
      </Helmet>
      <div className={`transition-colors ${pageBg}`}>
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
    </>
  );
}
