import React from "react";
import { Post } from "../services/post-service";

interface PostItemProps {
    post: Post;
    likePost: (id: string) => void;
    userImgUrl: string;
}

const PostComponent: React.FC<PostItemProps> = ({ post, likePost, userImgUrl }) => {
    return (
        <div className="post-card"> {/* Instagram-style card */}
            <div className="post-header">
                <img 
                    src={userImgUrl} 
                    alt="Profile" 
                    className="profile-img"
                />
                <span className="username">{post.owner || "Anonymous"}</span>
                <button className="more-options">⋮</button>
            </div>

            <img src={post.imgUrlPost}  className="post-image" />

            <div className="post-actions">
                <button onClick={() => likePost(post._id ?? "")} className="action-btn">❤️</button>
                <button className="action-btn">💬</button>
                <button className="action-btn">📤</button>
            </div>

            <p className="likes">{post.likes ?? 0} likes</p>
            <p className="caption"><strong>{post.owner}</strong> {post.content}</p>
        </div>
    );
};

export default PostComponent;
