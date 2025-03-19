import React from "react";
import { useParams, useLocation } from "react-router-dom";
import useComments from "../hooks/useComments";
import CommentService from "../services/comment-service";
import CommentComponent from "./Comment";

interface CommentsListProps {
  user: { _id: string };
}

const CommentsList: React.FC<CommentsListProps> = ({ user }) => {
  const { postId } = useParams();
  const location = useLocation();
  const allowDelete = location.state?.allowDelete ?? false;  // explicitly read state here

  const { data: comments, isLoading, error, like } = useComments(postId);

  const deleteComment = async (id: string) => {
    await CommentService.delete(id);
    window.location.reload();
  };

  if (isLoading) return <p>Loading comments...</p>;
  if (error) return <p>Error loading comments.</p>;

  return (
    <div>
      {comments.map(comment => (
        <CommentComponent
          key={comment._id}
          comment={comment}
          likeComment={like}
          userImgUrl={comment.ownerImage || "/default-profile.png"}
          ownerUsername={comment.ownerUsername || "Anonymous"}
          deleteComment={
            allowDelete && comment.owner === user._id ? deleteComment : undefined
          } // explicitly conditional here
        />
      ))}
    </div>
  );
};

export default CommentsList;
