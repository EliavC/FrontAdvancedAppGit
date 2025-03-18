import React, { useState, FC } from "react";
import usePosts from "../hooks/usePosts";
import PostComponent from "./Post";
import "./styles.css";
import CommentService, { Comment } from "../services/comment-service";

interface PostListProps {
  user: { username: string; email: string; _id: string }; // ✅ Ensure `_id` is included
}

const PostList: FC<PostListProps> = ({ user }) => {
    const { data: posts, isLoading, error, like } = usePosts();
    const [commentsByPost, setCommentsByPost] = useState<{ [key: string]: Comment[] }>({});
    
    console.log("Current User in PostList:", user);

    // ✅ Ensure `addComment` assigns the correct owner
    const addComment = async (postId: string, newCommentText: string) => {
        if (!user._id) {
            console.error("User ID is missing, cannot add comment.");
            return;
        }

        const newComment: Comment = {
            postId,
            owner: user._id, // ✅ Use the correct user ID
            comment: newCommentText,
            likes: 0,
        };

        try {
            const response = await CommentService.create(newComment);
            if (response && response.data) {
                setCommentsByPost((prevComments) => ({
                    ...prevComments,
                    [postId]: [...(prevComments[postId] || []), response.data],
                }));
            }
        } catch (error) {
            console.error("Error adding comment:", error);
        }
    };

    if (isLoading) return <p>Loading posts...</p>;
    if (error) return <p style={{ color: "red" }}>Error: {error}</p>;
    if (!posts || posts.length === 0) return <p>No posts available.</p>;

    return (
        <div className="post-list">
            <h2>Posts for {user.username}</h2> {/* ✅ Use username instead of email */}
            {posts.map((post) => (
                <PostComponent
                    key={post._id}
                    post={post}
                    likePost={like}
                    addComment={addComment} // ✅ Ensure `addComment` is passed
                    userImgUrl={post.ownerImage || "/default-profile.png"}
                    userName={post.ownerUsername || "Anonymous"}
                    commentCount={post.commentCount || 0}
                />
            ))}
        </div>
    );
};

export default PostList;
