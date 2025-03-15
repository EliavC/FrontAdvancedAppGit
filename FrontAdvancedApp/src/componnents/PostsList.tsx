import React, { useEffect, useState } from "react";
import usePosts from "../hooks/usePosts";
import { Post } from "../services/post-service"; 

const PostList = () => {
    const { data: posts, isLoading, error, like, getLikes } = usePosts();
    const [likesCount, setLikesCount] = useState<{ [key: string]: number }>({});

    useEffect(() => {
        posts.forEach((post) => {
            if (!post._id) return; // ✅ Prevents undefined `_id` from being used as a key

            const postId = post._id.toString(); // ✅ Ensure `_id` is a string

            getLikes(postId).then((count: number) => {
                console.log(`Likes for post ${postId}:`, count); // ✅ Debugging output
                setLikesCount(prev => ({
                    ...prev,
                    [postId]: typeof count === "number" ? count : 0 // ✅ Ensure it's a number
                }));
            }).catch((err: unknown) => {
                console.error(`Error fetching likes for post ${postId}:`, err);
            });
        });
    }, [posts]);

    if (isLoading) return <p>Loading posts...</p>;
    if (error) return <p style={{ color: "red" }}>Error: {error}</p>;
    if (!posts || posts.length === 0) return <p>No posts available.</p>;

    return (
        <div>
            <h2>Posts</h2>
            <ul>
                {posts.map((post) => {
                    if (!post._id) return null; // ✅ Skip rendering posts with missing `_id`

                    const postId = post._id.toString(); // ✅ Ensure `_id` is a string
                    const likes = likesCount[postId] ?? post.likes; // ✅ Ensure it's a number

                    return (
                        <li key={postId}>
                            {post.title || "Untitled Post"} - Likes: {typeof likes === "number" ? likes : 0}
                            <button onClick={() => like(postId)} disabled={!post._id}>👍 Like</button> 
                        </li>
                    );
                })}
            </ul>
        </div>
    );
};

export default PostList;
