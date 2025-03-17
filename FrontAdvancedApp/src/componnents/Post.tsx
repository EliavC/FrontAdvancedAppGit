import React from "react";
import { Post } from "../services/post-service";
import {getUserImgById } from "../services/user_service";


interface PostItemProps {
    post: Post;
    likePost: (id: string) => void;
   
}


const PostComponent: React.FC<PostItemProps> = ({ post, likePost}) => {
    const [userImg, setUserImg] = React.useState<string | null>(null);

    React.useEffect(() => {
        const fetchUserImg = async () => {
            const img = await getUserImgById(post.owner);
            setUserImg(img);
        };
        fetchUserImg();
    }, [post.owner]);

    return (
      
        <div className="post">
            {/* Top: Profile Image & Username */}
            <div className="post-header">
                <img 
                    src={userImg ?? "avatar.png"} 
                    
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
