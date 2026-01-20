import { Link, useParams } from "react-router-dom";
import Post from "../../components/Post/Post";
import LoadingPage from "../../components/LoadingPage/LoadingPage";
import { useSinglePost } from "../../Hooks/useSinglePost";
import { useTheme } from "../../Context/themeContext";
import { Helmet } from "react-helmet";

export default function SinglePost() {
  const { theme } = useTheme();
  const { id } = useParams();
  const { data: postDetails, isLoading } = useSinglePost(id);

  if (isLoading) return <LoadingPage />;

  const reversedComments = [...postDetails.comments].reverse();

  const pageBg =
    theme === "dark" ? "bg-[#0F0F14]" : "bg-transparent";

    
  return (
    <>
    <Helmet>
      <meta charSet="utf-8" />
      <title>Moody</title>
      <link rel="icon" href="public/bird.png" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />  
    </Helmet>
    <div className={`transition-colors ${pageBg}`}>
      <Post
        post={{ ...postDetails, comments: reversedComments }}
        allcomment={true}
      />
    </div>
    </>
  );
}
