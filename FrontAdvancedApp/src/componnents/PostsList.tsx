import { useState, FC } from "react";
import usePosts from "../hooks/usePosts";
import PostComponent from "./Post";
import "./styles.css";
import CommentService, { Comment } from "../services/comment-service";
import PostService from "../services/post-service";
import { useLocation, useNavigate } from "react-router-dom";


interface PostListProps {
  user: { username: string; email: string; _id: string };
  showUserPostsOnly?: boolean;
  allowEdit?: boolean;
}
const POSTS_PER_PAGE = 7;
const PostList: FC<PostListProps> = ({ user, showUserPostsOnly = false }) => {
  const location = useLocation();
  const { data: posts, isLoading, error, like } = usePosts(showUserPostsOnly ? user._id : undefined);
  //const [commentsByPost, setCommentsByPost] = useState<{ [key: string]: Comment[] }>({});
  const [currentPage, setCurrentPage] = useState(1);
  const navigate = useNavigate();
  const allowEdit = location.state?.allowEdit??false
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
        // setCommentsByPost((prevComments) => ({
        //   ...prevComments,
        //   [postId]: [...(prevComments[postId] || []), response.data],
        // }));
        navigate(`/comments/${postId}`,{ state: { allowDelete: true }});
      }
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  if (isLoading ) return <div className="spinner"></div>
  if (error) return <p style={{ color: "red" }}>Error: {error}</p>;
  if (!isLoading && posts.length === 0) return <p>No posts available.</p>;

  const totalPages = Math.ceil(posts.length / POSTS_PER_PAGE);
  const start = (currentPage - 1) * POSTS_PER_PAGE;
  const currentPosts = posts.slice(start, start + POSTS_PER_PAGE);



  // return (
  //   <div className="post-list">
  //     <h2>{showUserPostsOnly ? "My Posts" : "All Posts"}</h2>
  //     {posts.map((post) => (
  //       <PostComponent
  //         key={post._id}
  //         post={post}
  //         likePost={like}
  //         addComment={addComment} 
  //         userImgUrl={post.ownerImage || "/default-profile.png"}
  //         userName={post.ownerUsername || "Anonymous"}
  //         commentCount={post.commentCount || 0}
  //         deletePost={showUserPostsOnly ? deletePost : undefined}
  //         allowEdit={allowEdit || showUserPostsOnly}
  //       />
  //     ))}
  //   </div>
  // );
  return (
    <div className="post-list vertical">
      <h2>{showUserPostsOnly ? "My Posts" : "All Posts"}</h2>

      {currentPosts.map((post) => (
        <PostComponent
          key={post._id}
          post={post}
          likePost={like}
          addComment={addComment}
          userImgUrl={post.ownerImage || "/default-profile.png"}
          userName={post.ownerUsername || "Anonymous"}
          commentCount={post.commentCount || 0}
          deletePost={showUserPostsOnly ? deletePost : undefined}
          allowEdit={allowEdit || showUserPostsOnly}
        />
      ))}

      {/* Paging controls */}
      <div className="pagination">
        <button
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          disabled={currentPage === 1}
        >
          ⬅ Previous
        </button>

        <span>
          Page {currentPage} of {totalPages}
        </span>

        <button
          onClick={() =>
            setCurrentPage((prev) => Math.min(prev + 1, totalPages))
          }
          disabled={currentPage === totalPages}
        >
          Next ➡
        </button>
      </div>
    </div>
  );
};

export default PostList;
