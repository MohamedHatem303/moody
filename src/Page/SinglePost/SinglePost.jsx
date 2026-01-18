import { useParams } from "react-router-dom";
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

  return (
    <div className={`transition-colors ${pageBg}`}>
      <Post
        post={{ ...postDetails, comments: reversedComments }}
        allcomment={true}
      />
    </div>
  );
}
