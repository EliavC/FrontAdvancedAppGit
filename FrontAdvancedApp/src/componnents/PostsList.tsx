import React, { useState } from "react";
import usePosts from "../hooks/usePosts";
import PostComponent from "./Post";
import "./styles.css";
import CommentService, { Comment } from "../services/comment-service";

const PostList = () => {
    const { data: posts, isLoading, error, like } = usePosts();
    const [commentsByPost, setCommentsByPost] = useState<{ [key: string]: Comment[] }>({});

    // ✅ Ensure `addComment` exists and works correctly
    const addComment = async (postId: string, newCommentText: string) => {
        const newComment: Comment = {
            postId,
            owner: "Anonymous", // You can replace this with the actual user
            comment: newCommentText,
            likes: 0,
        };

        const response = await CommentService.create(newComment);
        if (response && response.data) {
            setCommentsByPost((prevComments) => ({
                ...prevComments,
                [postId]: [...(prevComments[postId] || []), response.data],
            }));
        }
    };

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
                    addComment={addComment} // ✅ Ensure `addComment` is passed
                    userImgUrl={post.ownerImage || "/default-profile.png"}
                    userName={post.ownerUsername || "Anonymous"}
                    commentCount={post.commentCount || 0} // ✅ Ensure `commentCount` is passed
                />
            ))}
        </div>
    );
};

export default PostList;
