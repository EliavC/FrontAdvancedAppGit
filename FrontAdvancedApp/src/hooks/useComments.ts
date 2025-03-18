import { useEffect, useState } from "react";
import useData from "./useData";
import { Comment } from "../services/comment-service";
import { getUserImgById } from "../services/user_service";
import CommentService from "../services/comment-service";

interface CommentWithImage extends Comment {
    ownerImage?: string;
}

const useComments = (postId?: string) => { 
    const { data: comments, isLoading, error, like: likeComment } = useData<Comment>(CommentService);
    const [filteredComments, setFilteredComments] = useState<CommentWithImage[]>([]);

    useEffect(() => {
        if (!comments) return;

        let postComments = comments;
        if (postId) {
            postComments = comments.filter(comment => comment.postId === postId);
        }

        const fetchUserImages = async () => {
            const userImgUrlsTemp: { [key: string]: string | null } = {};

            await Promise.all(
                postComments.map(async (comment) => {
                    if (comment.owner && !userImgUrlsTemp[comment.owner]) {
                        const img = await getUserImgById(comment.owner);
                        userImgUrlsTemp[comment.owner] = img || "/default-profile.png";
                    }
                })
            );

            const updatedComments = postComments.map((comment) => ({
                ...comment,
                ownerImage: userImgUrlsTemp[comment.owner] || "/default-profile.png",
            }));

            setFilteredComments(updatedComments);
        };

        fetchUserImages();
    }, [comments, postId]);

    // ✅ Fix: Update UI when liking a comment
    const likeCommentAndUpdate = async (commentId: string) => {
        const updatedComments = filteredComments.map((comment) =>
            comment._id === commentId ? { ...comment, likes: (comment.likes || 0) + 1 } : comment
        );
        setFilteredComments(updatedComments); // ✅ Update UI instantly

        await likeComment(commentId); // ✅ Make API request after updating UI
    };

    return { data: filteredComments, isLoading, error, like: likeCommentAndUpdate };
};

export default useComments;
