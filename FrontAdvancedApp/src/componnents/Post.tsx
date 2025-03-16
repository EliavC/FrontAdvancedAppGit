import React from "react";
import { Post } from "../services/post-service";

interface PostItemProps {
    post: Post;
    likePost: (id: string) => void;
    userImgUrl: string; // Add userImgUrl prop
}

const PostComponent: React.FC<PostItemProps> = ({ post, likePost, userImgUrl }) => {
    return (
        <div className="post">
            {/* Top: Profile Image & Username */}
            <div className="post-header">
                <img 
                    src={userImgUrl ? `http://localhost:3000/storage/${userImgUrl}` : "/default-profile.png"} 
                    alt="Profile" 
                    className="profile-img"
                />
                <span className="username">{post.owner || "Anonymous"}</span>
                <button className="more-options">⋮</button>
            </div>

            {/* Post Image */}
            <img src={post.imgUrlPost} alt="Post" className="post-image" />

            {/* Buttons */}
            <div className="post-actions">
                <button onClick={() => likePost(post._id ?? "")} className="action-btn">❤️</button>
                <button className="action-btn">💬</button>
                <button className="action-btn">📤</button>
            </div>

            {/* Likes & Caption */}
            <p className="likes">{post.likes ?? 0} likes</p>
            <p className="caption"><strong>{post.owner}</strong> {post.content}</p>
        </div>
    );
};

export default PostComponent;
