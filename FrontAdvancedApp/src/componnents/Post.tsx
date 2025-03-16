import React from "react";
import { Post } from "../services/post-service";

interface ExtendedPost extends Post {
    ownerImage?: string;
    imageUrl?: string;
}

interface PostProps {
    post: ExtendedPost;
    likePost: (id: string) => void;
}

const PostItem: React.FC<PostProps> = ({ post, likePost }) => {
    return (
        <div className="post">
            {/* Top: Profile Image & Username */}
            <div className="post-header">
                <img 
                    src={post.ownerImage ? `http://localhost:3000/storage/${post.ownerImage}` : "/default-profile.png"} 
                    alt="Profile" 
                    className="profile-img"
                />
                <span className="username">{post.owner || "Anonymous"}</span>
                <button className="more-options">⋮</button>
            </div>

            {/* Post Image */}
            <img src={post.imageUrl} alt="Post" className="post-image" />

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

export default PostItem;
