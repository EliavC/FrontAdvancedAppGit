// CreatePost.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import PostService from "../services/post-service"; 
import user_service from "../services/user_service"; // for file upload? or you can do a direct axios call
// import "./CreatePost.css"; // if you want separate CSS

interface CreatePostProps {
  user?: {
    _id?: string;
    username?: string;
    email?: string;
  };
}

const CreatePost: React.FC<CreatePostProps> = ({ user }) => {
  const navigate = useNavigate();

  // Basic form fields
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  // For storing the actual File object
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  // The URL we get back after uploading the file
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // If no user ID, that means we have no token or user data
    // Double-check localStorage or your global state
    

    try {
      let finalImageUrl = uploadedImageUrl;
      // If a file is selected but not yet uploaded, do it now
      if (selectedFile && !uploadedImageUrl) {
        const uploadResponse = await user_service.uploadImage(selectedFile);
        // The backend returns { url: "..." }
        finalImageUrl = (await uploadResponse.request).data.url; 
      }

      // Prepare the new post object
      const newPost = {
        title,
        content,
        owner: user?._id || "",    // user’s ID from props
        likes: [],          // start with no likes
        imgUrlPost: finalImageUrl || "",
      };

      // Call the POST /posts endpoint (authMiddleware requires a valid token)
      const response = await PostService.create(newPost);

      if (response && response.data) {
        // Post created successfully
        alert("Post created!");
        navigate("/home",{ state: user }); // or /posts
      } else {
        alert("Failed to create post. (No response data)");
      }
    } catch (error) {
      console.error("Error creating post:", error);
      alert("Failed to create post. Please try again.");
    }
  };

  // Handler for the <input type="file" />
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setSelectedFile(e.target.files[0]);
    }
  };

  // If you want to upload the image as soon as user picks the file, you can do so.
  // But here, we do it on submission. Alternatively:
  const handleUploadNow = async () => {
    if (!selectedFile) return;
    try {
      const uploadResponse = await user_service.uploadImage(selectedFile);
      const url = (await uploadResponse.request).data.url;
      setUploadedImageUrl(url);
      alert("Image uploaded!");
    } catch (err) {
      console.error(err);
      alert("Image upload failed");
    }
  };

  return (
    <div className="create-post-container" style={{ maxWidth: "500px", margin: "0 auto" }}>
      <h2>Create New Post</h2>
      <form onSubmit={handleSubmit}>
        <label>Title</label>
        <input
          type="text"
          required
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <label>Content</label>
        <textarea
          rows={3}
          required
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <label>Upload an Image</label>
        <input type="file" accept="image/*" onChange={handleFileChange} />
        {/* Optional button to upload the image immediately */}

        <br />
        <button type="submit">Create Post</button>
        &nbsp;
        <button type="button" onClick={() => navigate("/home",{ state: user })}>
          Cancel
        </button>
      </form>
    </div>
  );
};

export default CreatePost;
