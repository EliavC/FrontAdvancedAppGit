import CommentComponent from "./Comment";
import "./styles.css"; 
import useComments from "../hooks/useComments";

const CommentList = () => {
    const { data: comments, isLoading, error, like } = useComments(); // ✅ Now posts include `ownerImage`

    if (isLoading) return <p>Loading comments...</p>;
    if (error) return <p style={{ color: "red" }}>Error: {error}</p>;
    if (!comments || comments.length === 0) return <p>No comments available.</p>;

    return (
        <div className="post-list"> 
            {comments.map((comment) => (
                <CommentComponent
                    key={comment._id} 
                    comment={comment} 
                    likeComment={like} 
                    userImgUrl={comment.ownerImage || "/default-profile.png"} // ✅ Now using `ownerImage`
                />
            ))}
        </div>
    );
};

export default CommentList;
