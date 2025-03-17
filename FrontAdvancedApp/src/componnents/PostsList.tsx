import React from "react";
import usePosts from "../hooks/usePosts";
import PostComponent from "./Post";
import "./styles.css"; 

const PostList = () => {
    const { data: posts, isLoading, error, like } = usePosts(); // ✅ Now posts include `ownerImage`

    if (isLoading) return <p>Loading posts...</p>;
    if (error) return <p style={{ color: "red" }}>Error: {error}</p>;
    if (!posts || posts.length === 0) return <p>No posts available.</p>;

    return (
        <div className="post-list"> 
            {posts.map((post) => (
                <PostComponent 
                    key={post._id} 
                    post={post} 
                    likePost={like} 
                    userImgUrl={post.ownerImage || "/default-profile.png"} // ✅ Now using `ownerImage`
                    userName={post.ownerUsername || "SecrerSpy"} // ✅ Now using `owner`
                />
            ))}
        </div>
    );
};

export default PostList;
