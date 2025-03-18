import React from "react";
import { useParams } from "react-router-dom";
import useComments from "../hooks/useComments";
import CommentComponent from "./Comment";

const CommentsList = () => {
    const { postId } = useParams(); 
    const { data: comments, isLoading, error, like } = useComments(postId); 

    if (isLoading) return <p>Loading comments...</p>;
    if (error) return <p style={{ color: "red" }}>Error: {error}</p>;
    if (!comments.length) return <p>No comments available for this post.</p>;

    return (
        <div className="comment-list">
            <h2>Comments</h2>
            {comments.map((comment) => (
                <CommentComponent 
                    key={comment._id} 
                    comment={comment} 
                    likeComment={like} 
                    userImgUrl={comment.ownerImage || "/default-profile.png"} // ✅ Now passing the correct image
                    ownerUsername={comment.ownerUsername || "Anonymous"} // ✅ Now passing the correct username
                />
            ))}
        </div>
    );
};

export default CommentsList;
