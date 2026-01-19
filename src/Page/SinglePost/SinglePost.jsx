import { Link, useParams } from "react-router-dom";
import Post from "../../components/Post/Post";
import LoadingPage from "../../components/LoadingPage/LoadingPage";
import { useSinglePost } from "../../Hooks/useSinglePost";
import { useTheme } from "../../Context/themeContext";

export default function SinglePost() {
  const { theme } = useTheme();
  const { id } = useParams();
  const { data: postDetails, isLoading } = useSinglePost(id);

  if (isLoading) return <LoadingPage />;

  const reversedComments = [...postDetails.comments].reverse();

  const pageBg =
    theme === "dark" ? "bg-[#0F0F14]" : "bg-transparent";

    const accentText =
    theme === "dark" ? "text-[#7C3AED]" : "text-[#35037F]";
  return (
    <div className={`transition-colors ${pageBg}`}>
      <Link
        to="/Home"
        className={`flex items-center gap-2 mb-3 ${accentText}`}
      >
        <i className="fa-solid fa-arrow-left" />
        <span>Back</span>
      </Link>
      <Post
        post={{ ...postDetails, comments: reversedComments }}
        allcomment={true}
      />
    </div>
  );
}
