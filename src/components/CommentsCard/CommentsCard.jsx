import React, { useContext } from "react";
import userImage from "../../assets/userImage.png";
import CommentDropDown from "../CommentDropDown/CommentDropDown";
import { AuthContext } from "../../Context/authContext";
import { useTheme } from "../../Context/themeContext";

export default function CommentsCard({
  comment,
  getTimeAgo,
  allcomment,
  id,
  callback,
}) {
  const { userData } = useContext(AuthContext);
  const { theme } = useTheme();

  if (!comment || !comment.commentCreator) return null;

  const userId = userData?._id;
  const commentCreatorId = comment.commentCreator?._id;

  const isOwner = userId && commentCreatorId && userId === commentCreatorId;
  const isPostOwner = userId && id && userId === id;

  const cardBg =
    theme === "dark"
      ? "bg-[#1C1C26] border-[#2F2F45] text-[#EDEDF0]"
      : "bg-gray-100 border-gray-200 text-gray-900";

  const nameColor = theme === "dark" ? "text-[#7C3AED]" : "text-[#35037F]";

  const mutedText = theme === "dark" ? "text-gray-400" : "text-gray-500";

  return (
    <>
      <div
        className={`${
          allcomment ? `border rounded-2xl shadow-sm m-1 p-3 ${cardBg}` : ""
        } flex justify-between items-start gap-3 mt-2 mx-4`}
      >
        <div className="flex items-start gap-3">
          <img
            onError={(e) => {
              e.target.src = userImage;
            }}
            src={comment.commentCreator.photo}
            className="w-10 h-10 rounded-full"
            alt="user"
          />

          <div
            className={`${
              !allcomment ? `min-w-40 px-2 pt-2 pb-4 rounded-xl ${cardBg}` : ""
            } flex justify-between`}
          >
            <div>
              <p className={`${nameColor}`}>
                {comment.commentCreator.name}
                {allcomment && (
                  <span className={`ms-2 text-sm ${mutedText}`}>
                    {getTimeAgo(comment.createdAt)}
                  </span>
                )}
              </p>

              <p
                className={theme === "dark" ? "text-gray-200" : "text-gray-800"}
              >
                {comment.content}
              </p>
            </div>

            {isOwner && isPostOwner && !allcomment && (
              <div className="flex justify-center items-start pt-1">
                <CommentDropDown
                  commentBodyOld={comment.content}
                  callback={callback}
                  commentId={comment._id}
                  Dimensions={"min-w-40"}
                  placement={"right"}
                />
              </div>
            )}
          </div>
        </div>

        {isOwner && isPostOwner && allcomment && (
          <div className="pt-2">
            <CommentDropDown
              commentBodyOld={comment.content}
              callback={callback}
              commentId={comment._id}
              Dimensions={"w-16 h-16"}
              placement={"left"}
            />
          </div>
        )}
      </div>

      {!allcomment && (
        <div className="mx-20 p-1 flex items-start gap-3 w-fit">
          <span className={mutedText}>{getTimeAgo(comment.createdAt)}</span>
        </div>
      )}
    </>
  );
}