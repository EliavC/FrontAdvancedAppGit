import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import useComments from "../hooks/useComments";
import CommentService from "../services/comment-service";
import CommentComponent from "./Comment";
import "./comment.css"
interface CommentsListProps {
  user: { _id: string }
}

const CommentsList: React.FC<CommentsListProps> = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const { data: comments, isLoading, error, like } = useComments(postId);
  const storedUserStr = localStorage.getItem("user");
  const user = storedUserStr ? JSON.parse(storedUserStr) : null;
  
  const deleteComment = async (id: string) => {
    await CommentService.delete(id);
    navigate("/profile",{state:user})
  };
  const editComment = async (id: string, updatedText: string) => {
    await CommentService.update(id, { comment: updatedText });
    navigate("/profile",{state:user}) // Refresh the comment list after editing
  };

  if (isLoading) return <div className="spinner"></div>;
  if (error) return <p>Error loading comments.</p>;

  return (
    <div style={{ padding: "20px" }}>
      {/* Add the new buttons here */}
      <div style={{ marginBottom: "20px" }}>
        <button onClick={() => navigate("/home")}>Back to Home</button>{" "}
        <button onClick={() => navigate("/profile")}>Back to Profile</button>
      </div>

      {comments.map((comment) => (
        <CommentComponent
          key={comment._id}
          comment={comment}
          likeComment={like}
          userImgUrl={comment.ownerImage || "/default-profile.png"}
          ownerUsername={comment.ownerUsername || "Anonymous"}
          deleteComment={comment.owner === user._id ? deleteComment : undefined}
          editComment={comment.owner === user._id ? editComment : undefined}
        />
      ))}
    </div>
  );
};

export default CommentsList;
