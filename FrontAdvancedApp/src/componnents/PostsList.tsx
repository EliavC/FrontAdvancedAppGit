import React, { useState, FC } from "react";
import usePosts from "../hooks/usePosts";
import PostComponent from "./Post";
import "./styles.css";
import CommentService, { Comment } from "../services/comment-service";
import PostService from "../services/post-service";


interface PostListProps {
  user: { username: string; email: string; _id: string };
  showUserPostsOnly?: boolean;
}

const PostList: FC<PostListProps> = ({ user, showUserPostsOnly = false }) => {
  const { data: posts, isLoading, error, like } = usePosts(showUserPostsOnly ? user._id : undefined);
  const [commentsByPost, setCommentsByPost] = useState<{ [key: string]: Comment[] }>({});

  // ✅ Properly implement addComment function
  const deletePost = async (postId: string) => {
    await PostService.delete(postId);
    window.location.reload();
  };

  const addComment = async (postId: string, newCommentText: string) => {
    if (!user._id) {
      console.error("User ID is missing, cannot add comment.");
      return;
    }

    const newComment: Comment = {
      postId,
      owner: user._id,
      comment: newCommentText,
      likes: [],
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
  if (!posts.length) return <p>No posts available.</p>;



  return (
    <div className="post-list">
      <h2>{showUserPostsOnly ? "My Posts" : "All Posts"}</h2>
      {posts.map((post) => (
        <PostComponent
          key={post._id}
          post={post}
          likePost={like}
          addComment={addComment} // ✅ Correctly pass addComment here
          userImgUrl={post.ownerImage || "/default-profile.png"}
          userName={post.ownerUsername || "Anonymous"}
          commentCount={post.commentCount || 0}
          deletePost={showUserPostsOnly ? deletePost : undefined}
        />
      ))}
    </div>
  );
};

export default PostList;
