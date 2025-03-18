import React from "react";
import { useParams } from "react-router-dom";
import useComments from "../hooks/useComments";
import CommentComponent from "./Comment";

const CommentsList = () => {
    const { postId } = useParams(); // ✅ Get postId from URL
    const { data: comments, isLoading, error } = useComments(postId); // ✅ Fetch only comments for this post

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
                    likeComment={() => {}} 
                    userImgUrl={comment.ownerImage || "/default-profile.png"}
                />
            ))}
        </div>
    );
};

export default CommentsList;
