import React from "react";
import { useNavigate } from "react-router-dom"; // ✅ Import for navigation
import { Post } from "../services/post-service";

interface PostItemProps {
    post: Post;
    likePost: (id: string) => void;
    addComment: (postId: string, comment: string) => void;
    userImgUrl: string;
    userName: string;
}

const PostComponent: React.FC<PostItemProps> = ({ post, likePost, addComment, userImgUrl, userName }) => {
    const navigate = useNavigate(); // ✅ Navigation Hook
    const [newComment, setNewComment] = React.useState(""); // ✅ State for new comment

    // ✅ Handle adding a comment
    const handleAddComment = () => {
        if (newComment.trim() !== "") {
            addComment(post._id ?? "", newComment);
            setNewComment(""); // Clear input field after adding comment
        }
    };

    return (
        <div className="post-card"> {/* Instagram-style card */}
            
            {/* Post Header */}
            <div className="post-header">
                <div className="user-info">
                    <img src={userImgUrl} alt="Profile" className="profile-img" />
                    <span className="username">{userName || "Anonymous"}</span>
                </div>
                <button className="more-options">⋮</button> {/* Top-right More Options */}
            </div>

            {/* Post Image */}
            <img src={post.imgUrlPost} className="post-image" />

            {/* Post Content */}
            <p className="caption"><strong>{userName}</strong> {post.content}</p>

            {/* Action Buttons & Counters */}
            <div className="post-actions">
                <div className="action-item">
                    <button onClick={() => likePost(post._id ?? "")} className="action-btn">❤️</button>
                    <span className="count">{post.likes ?? 0}</span> {/* Like Counter */}
                </div>
                <div className="action-item comment-section">
                    <button className="action-btn">💬</button>
                    {/* <span className="count">{post.comments?.length ?? 0}</span> Comment Counter */}
                </div>
            </div>

            {/* Add Comment Section */}
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

            {/* View Comments Button */}
            <button onClick={() => navigate(`/comments/${post._id}`)} className="view-comments-btn">
                View Comments
            </button>
        </div>
    );
};

export default PostComponent;
