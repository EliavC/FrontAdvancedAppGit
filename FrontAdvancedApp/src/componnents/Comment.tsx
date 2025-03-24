

import React, { useState } from "react";
import { Comment } from "../services/comment-service";
import './comment.css'
interface CommentItemProps {
  comment: Comment;
  likeComment: (id: string) => void;
  userImgUrl: string;
  ownerUsername: string;
  currentUser?: { _id: string };
  deleteComment?: (id: string) => void;
  editComment?: (id: string, updatedText: string) => void;
}

const CommentComponent: React.FC<CommentItemProps> = ({
  comment,
  likeComment,
  userImgUrl,
  ownerUsername,
  currentUser,
  deleteComment,
  editComment,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedComment, setEditedComment] = useState(comment.comment);

  const isLikedByCurrentUser = currentUser
    ? comment.likes?.includes(currentUser._id)
    : false;

  const handleSaveEdit = () => {
    if (editComment && editedComment.trim() !== "") {
      editComment(comment._id ?? "", editedComment);
      setIsEditing(false);
    }
  };

  return (
    <div className="post-card">
      <div className="post-header">
        <img
          src={comment.ownerImage || userImgUrl}
          alt="Profile"
          className="profile-img"
        />
        <span className="username">{comment.ownerUsername || ownerUsername}</span>

        <div>
          {deleteComment && (
            <>
              <button onClick={() => deleteComment(comment._id ?? "")}>
                🗑️ Delete
              </button>
              <button onClick={() => setIsEditing(true)}>✏️ Edit</button>
            </>
          )}
        </div>
      </div>

      <div className="post-actionss">
        <button
          onClick={() => likeComment(comment._id ?? "")}
          className="action-btn"
        >
          {isLikedByCurrentUser ? "❤️" : "🤍"}
        </button>
        <span>{comment.likes?.length ?? 0} likes</span>
      </div>

      {isEditing ? (
        <div>
          <input
            type="text"
            value={editedComment}
            onChange={(e) => setEditedComment(e.target.value)}
          />
          <button onClick={handleSaveEdit}>💾 Save</button>
          <button onClick={() => setIsEditing(false)}>❌ Cancel</button>
        </div>
      ) : (
        <p className="caption">
          <strong>{comment.ownerUsername}</strong> {comment.comment}
        </p>
      )}
    </div>
  );
};

export default CommentComponent;

