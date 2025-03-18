import React from "react";
import { Comment } from "../services/comment-service";

interface CommentItemProps {
    comment: Comment;
    likeComment: (id: string) => void;
    userImgUrl: string;
}

const CommentComponent: React.FC<CommentItemProps> = ({ comment, likeComment, userImgUrl }) => {
    return (
        <div className="post-card">
            <div className="post-header">
                <img src={userImgUrl} alt="Profile" className="profile-img" />
                <span className="username">{comment.owner || "Anonymous"}</span>
                <button className="more-options">⋮</button>
            </div>

            <div className="post-actions">
                {/* ✅ Fix: Call `likeComment` when clicking the heart button */}
                <button onClick={() => likeComment(comment._id ?? "")} className="action-btn">❤️</button>
                <span>{comment.likes ?? 0} likes</span> {/* ✅ Display like count */}
            </div>

            <p className="caption"><strong>{comment.owner}</strong> {comment.comment}</p>
        </div>
    );
};

export default CommentComponent;
