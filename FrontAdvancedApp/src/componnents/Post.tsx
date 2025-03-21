import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PostService, { Post } from "../services/post-service";
import user_service from "../services/user_service";

interface PostItemProps {
  post: Post;
  likePost: (id: string) => void;
  addComment: (postId: string, comment: string) => void;
  userImgUrl: string;
  userName: string;
  commentCount: number;
  currentUser?: { _id: string };
  allowEdit?: boolean; 
  deletePost?: (id: string) => void; 
};
 
const PostComponent: React.FC<PostItemProps> = ({
  post,
  likePost,
  addComment,
  userImgUrl,
  userName,
  commentCount,
  currentUser,
  allowEdit,
  deletePost,
}) => {
  const navigate = useNavigate();
  
  const [newComment, setNewComment] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [newContent, setNewContent] = useState(post.content);
  const [newImage, setNewImage] = useState<File | null>(null);
  const [imgPreview, setImgPreview] = useState(post.imgUrlPost);

  const isLikedByCurrentUser = currentUser
    ? post.likes?.includes(currentUser._id)
    : false;
    useEffect(() => {
      if (newImage) {
        setImgPreview(URL.createObjectURL(newImage));
      }
    }, [newImage]);

  const handleAddComment = async() => {
    if (newComment.trim() !== "") {
      addComment(post._id ?? "", newComment);
      setNewComment("");
      navigate(`/comments/${post._id}`);
    }
  };
  // const handleEdit = async () => {
  //   try {
  //     let updatedImgUrl = post.imgUrlPost; // Keep old image if no new image selected
  
  //     if (newImage) {
  //       const { request } = user_service.uploadImage(newImage);
  //       const response = await request;
  //       updatedImgUrl = response.data.url;
  //     }
  
  //     const updatedPost = {
  //       ...post,
  //       content: newContent,
  //       imgUrlPost: updatedImgUrl,
  //     };
  
  //     await PostService.update(post._id!, updatedPost); // ✅ Save to database
  
  //     alert("Post updated successfully!");
  //     setIsEditing(false); // Exit edit mode
  //     window.location.reload(); // Refresh profile page to reflect changes
  //   } catch (error) {
  //     console.error("Error updating post:", error);
  //   }
  // };

  useEffect(() => {
    if (newImage) {
      setImgPreview(URL.createObjectURL(newImage));
    }
  }, [newImage]);

  const handleEdit = async (e: React.FormEvent) => {
    e.preventDefault(); 

    try {
      let updatedImgUrl = post.imgUrlPost; 
  
      if (newImage) {
        const { request } = user_service.uploadImage(newImage);
        const response = await request;
        updatedImgUrl = response.data.url;
      }
  
      const updatedPost = {
        ...post,
        content: newContent,
        imgUrlPost: updatedImgUrl,
      };
  
      await PostService.update(post._id!, updatedPost); 
  
      alert("Post updated successfully!");
      setIsEditing(false); 
      window.location.reload(); 
    } catch (error) {
      console.error("Error updating post:", error);
    }
  };

  const handleDelete = () => {
    if (deletePost && post._id) {
        deletePost(post._id);
    }
  };

  const handleToggleLike = () => {
    if (post._id) {
      likePost(post._id);
    }
  };


// return (
//   <div className="post-card">
//     <div className="post-header">
//       <div className="user-info">
//         {userImgUrl ? <img src={userImgUrl} alt="Profile" className="profile-img" /> : null}
//         <span className="username">{userName || "Anonymous"}</span>
//       </div>
      
//       {allowEdit && !isEditing && <button onClick={() => setIsEditing(true)}>✏️ Edit</button>}
//       {deletePost && <button onClick={handleDelete}>🗑️ Delete</button>}
//     </div>

//     {isEditing ? (
      
//       <form onSubmit={handleEdit} className="edit-form">
//         <label htmlFor={`fileInput-${post._id}`} className="upload-label">
//           <img
//             src={imgPreview || "/default-image.png"}
//             alt="Post"
//             style={{ width: "100%", cursor: "pointer", borderRadius: 10 }}
//           />
//         </label>
//         <input
//           type="file"
//           id={`fileInput-${post._id}`}
//           accept="image/*"
//           onChange={(e) => {
//             if (e.target.files && e.target.files.length > 0) {
//               const selectedFile = e.target.files[0];
//               setNewImage(selectedFile);
//               setImgPreview(URL.createObjectURL(selectedFile));
//             }
//           }}
//           style={{ display: "none" }}
//         />

//         <textarea
//           value={newContent}
//           onChange={(e) => setNewContent(e.target.value)}
//           style={{ width: "100%", height: 80, marginTop: 10 }}
//         />
//         <button type="submit">Save Changes</button>
//         <button type="button" onClick={() => setIsEditing(false)}>Cancel</button>
//       </form>
//     ) : (
//       <>
//         {post.imgUrlPost ? <img src={post.imgUrlPost} className="post-image" alt="Post" /> : null}
//         <p className="caption">
//           <strong>{userName}</strong> {post.content}
//         </p>
//       </>
//     )}

//     <div className="post-actions">
//       <button onClick={handleToggleLike} className="action-btn">
//         {currentUser && post.likes?.includes(currentUser._id) ? "❤️" : "🤍"}
//       </button>
//       <span className="count">{post.likes?.length ?? 0}</span>
//     </div>

//     <div className="action-item">
//       <button className="action-btn">💬</button>
//       <span className="count">{commentCount} comments</span>
//     </div>

//     <div className="add-comment">
//       <input
//         type="text"
//         placeholder="Write a comment..."
//         value={newComment}
//         onChange={(e) => setNewComment(e.target.value)}
//         className="comment-input"
//       />
//       <button onClick={() => addComment(post._id ?? "", newComment)} className="comment-btn">
//         Add
//       </button>
//     </div>

//     <button
//       onClick={() => navigate(`/comments/${post._id}`, { state: { allowDelete: true } })}
//       className="view-comments-btn"
//     >
//       View Comments
//     </button>
//   </div>
// );


return (
  <div className="post-card">
    <div className="post-header">
  <div className="user-info">
    <img src={userImgUrl} alt="Profile" className="profile-img" />
    <span className="username">{userName || "Anonymous"}</span>
  </div>

  <div className="post-actions">
    {allowEdit && !isEditing && (
      <button onClick={() => setIsEditing(true)} className="edit-btn">✏️ Edit</button>
    )}
    
    {deletePost && (
      <button onClick={handleDelete} className="delete-btn">🗑️ Delete</button>
    )}
  </div>
</div>

    {isEditing ? (
      <form onSubmit={handleEdit} className="edit-form">
        <label htmlFor={`fileInput-${post._id}`} className="upload-label">
          <img
            src={imgPreview || "/default-image.png"}
            alt="Post"
            className="post-image"
          />
        </label>
        <input
          type="file"
          id={`fileInput-${post._id}`}
          accept="image/*"
          onChange={(e) => {
            if (e.target.files && e.target.files.length > 0) {
              const selectedFile = e.target.files[0];
              setNewImage(selectedFile);
              setImgPreview(URL.createObjectURL(selectedFile));
            }
          }}
          style={{ display: "none" }}
        />

        <textarea
          value={newContent}
          onChange={(e) => setNewContent(e.target.value)}
          className="edit-textarea"
        />
        <div className="edit-buttons">
          <button type="submit" className="save-button">Save</button>
          <button type="button" onClick={() => setIsEditing(false)} className="cancel-button">Cancel</button>
        </div>
      </form>
    ) : (
      <>
        {post.imgUrlPost && <img src={post.imgUrlPost} className="post-image" alt="Post" />}
        <p className="caption">
          <strong>{userName}</strong> {post.content}
        </p>
      </>
    )}

    <div className="post-footer">
      <div className="post-actions">
        <button onClick={handleToggleLike} className={`like-btn ${isLikedByCurrentUser ? "liked" : ""}`}>
          {isLikedByCurrentUser ? "❤️" : "🤍"}
        </button>
        <span className="count">{post.likes?.length ?? 0}</span>
      </div>

      <div className="post-comments">
        <button className="comment-btn" onClick={() => navigate(`/comments/${post._id}`)}>💬 {commentCount}</button>
      </div>
    </div>

    <div className="add-comment">
      <input
        type="text"
        placeholder="Write a comment..."
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
        className="comment-input"
      />
      <button onClick={handleAddComment} className="comment-submit">Post</button>
    </div>
  </div>
);

};

export default PostComponent;
