import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Post } from "../services/post-service";

interface PostItemProps {
  post: Post;
  likePost: (id: string) => void;
  addComment: (postId: string, comment: string) => void;
  userImgUrl: string;
  userName: string;
  commentCount: number;
  // Now we also need the current user to check if they've liked
  currentUser?: { _id: string };
  allowEdit?: boolean; // New prop to conditionally show buttons
  deletePost?: (id: string) => void; // New delete method
};
 
const PostComponent: React.FC<PostItemProps> = ({
  post,
  likePost,
  addComment,
  userImgUrl,
  userName,
  commentCount,
  currentUser,
  deletePost,
}) => {
  const navigate = useNavigate();
  const [newComment, setNewComment] = useState("");

  // Check if the current user has already liked this post
  const isLikedByCurrentUser = currentUser
    ? post.likes?.includes(currentUser._id)
    : false;

  const handleAddComment = async() => {
    if (newComment.trim() !== "") {
      addComment(post._id ?? "", newComment);
      setNewComment("");
      navigate(`/comments/${post._id}`);
    }
  };

  const handleDelete = () => {
    if (deletePost && post._id) {
        deletePost(post._id);
    }
  };

  const handleToggleLike = () => {
    if (post._id) {
      likePost(post._id);
    }
  };

  return (
    <div className="post-card">
      <div className="post-header">
        <div className="user-info">
        {userImgUrl ? <img src={userImgUrl}  alt="Profile" className="profile-img" />: null}
          <span className="username">{userName || "Anonymous"}</span>
        </div>
        {deletePost && <button onClick={handleDelete}>🗑️ Delete</button>}
      </div>

      {post.imgUrlPost ? <img src={post.imgUrlPost} className="post-image" alt="Post" />: null}


      <p className="caption">
        <strong>{userName}</strong> {post.content}
      </p>

      <div className="post-actions">
        <button onClick={handleToggleLike} className="action-btn">
          {isLikedByCurrentUser ? "❤️" : "🤍"}
        </button>
        <span className="count">{post.likes?.length ?? 0}</span>
      </div>

      <div className="action-item">
        <button className="action-btn">💬</button>
        <span className="count">{commentCount} comments</span>
      </div>

      <div className="add-comment">
        <input
          type="text"
          placeholder="Write a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          className="comment-input"
        />
        <button onClick={handleAddComment} className="comment-btn">
          Add
        </button>
      </div>

      // Example fix in PostComponent.tsx clearly:
<button
    onClick={() => navigate(`/comments/${post._id}`, { state: { allowDelete: true } })}
    className="view-comments-btn"
>
    View Comments
</button>

    </div>
  );
};

export default PostComponent;
