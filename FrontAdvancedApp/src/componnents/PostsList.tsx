import React, { useEffect, useState } from "react";
import usePosts from "../hooks/usePosts";
import PostComponent from "./Post";
import { getUserById } from "../services/user_service"; // Import getUserById

const PostList = () => {
    const { data: posts, isLoading, error, like } = usePosts();
    const [userImgUrls, setUserImgUrls] = useState<{ [key: string]: string }>({});

    useEffect(() => {
        const fetchUserImages = async () => {
            const userImgUrlsTemp: { [key: string]: string } = {};
            for (const post of posts) {
                if (post.owner) {
                    const user = await getUserById(post.owner);
                    if (user && user.imgUrl) {
                        userImgUrlsTemp[post.owner] = user.imgUrl;
                    }
                }
            }
            setUserImgUrls(userImgUrlsTemp);
        };

        if (posts) {
            fetchUserImages();
        }
    }, [posts]);

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
                    userImgUrl={userImgUrls[post.owner] || "/default-profile.png"} // Pass userImgUrl
                />
            ))}
        </div>
    );
};

export default PostList;
