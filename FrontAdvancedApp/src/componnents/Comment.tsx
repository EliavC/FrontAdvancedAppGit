import React from "react";
import { Comment } from "../services/comment-service";

interface CommentItemProps {
    comment: Comment;
    likeComment: (id: string) => void;
    userImgUrl: string;
    ownerUsername: string;
}

const CommentComponent: React.FC<CommentItemProps> = ({ comment, likeComment, userImgUrl, ownerUsername }) => {
    return (
        <div className="post-card">
            <div className="post-header">
                <img src={comment.ownerImage || userImgUrl} alt="Profile" className="profile-img" />
                <span className="username">{comment.ownerUsername || "Anonymous"}</span> 
                <button className="more-options">⋮</button>
            </div>

            <div className="post-actions">
                <button onClick={() => likeComment(comment._id ?? "")} className="action-btn">❤️</button>
                <span>{comment.likes ?? 0} likes</span> 
            </div>

            <p className="caption"><strong>{comment.ownerUsername}</strong> {comment.comment}</p>
        </div>
    );
};

export default CommentComponent;
