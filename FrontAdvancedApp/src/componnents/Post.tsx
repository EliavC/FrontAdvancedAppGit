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
}

const PostComponent: React.FC<PostItemProps> = ({ post, likePost, addComment, userImgUrl, userName, commentCount }) => {
    const navigate = useNavigate();
    const [newComment, setNewComment] = useState("");

    const handleAddComment = () => {
        if (newComment.trim() !== "") {
            addComment(post._id ?? "", newComment);
            setNewComment("");

            // ✅ Redirect to the correct comments page after adding a comment
            navigate(`/comments/${post._id}`);
        }
    };

    return (
        <div className="post-card">
            <div className="post-header">
                <div className="user-info">
                    <img src={userImgUrl} alt="Profile" className="profile-img" />
                    <span className="username">{userName || "Anonymous"}</span>
                </div>
                <button className="more-options">⋮</button>
            </div>

            <img src={post.imgUrlPost} className="post-image" />

            <p className="caption"><strong>{userName}</strong> {post.content}</p>

            <div className="post-actions">
                <button onClick={() => likePost(post._id ?? "")} className="action-btn">❤️</button>
                <span className="count">{post.likes ?? 0}</span>
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
                <button onClick={handleAddComment} className="comment-btn">Add</button>
            </div>

            <button onClick={() => navigate(`/comments/${post._id}`)} className="view-comments-btn">
                View Comments
            </button>
        </div>
    );
};

export default PostComponent;
