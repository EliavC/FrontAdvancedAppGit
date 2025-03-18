import { useEffect, useState } from "react";
import useData from "./useData";
import { Comment } from "../services/comment-service";
import { getUserImgById, getUserNameById } from "../services/user_service";
import CommentService from "../services/comment-service";

interface CommentWithDetails extends Comment {
    ownerImage?: string;
    ownerUsername?: string;
}

const useComments = (postId?: string) => {
    const { data: comments, isLoading, error, like: likeComment } = useData<Comment>(CommentService);
    const [filteredComments, setFilteredComments] = useState<CommentWithDetails[]>([]);

    useEffect(() => {
        if (!comments) return;

        let postComments = comments;
        if (postId) {
            postComments = comments.filter(comment => comment.postId === postId);
        }

        const fetchUserDetails = async () => {
            if (!comments || comments.length === 0) return;/////////
            const userDetails: { [key: string]: { image?: string; username?: string } } = {};

            await Promise.all(
                postComments.map(async (comment) => {
                    if (comment.owner && (!userDetails[comment.owner] || !userDetails[comment.owner].username)) {
                        try {
                            const [img, username] = await Promise.all([
                                getUserImgById(comment.owner),
                                getUserNameById(comment.owner),
                            ]);

                            userDetails[comment.owner] = {
                                image: img || "/default-profile.png",
                                username: username || "Anonymous",
                            };
                        } catch (error) {
                            console.error("Error fetching user details:", error);
                        }
                    }
                })
            );

            const updatedComments: CommentWithDetails[] = postComments.map((comment) => ({
                ...comment,
                ownerImage: userDetails[comment.owner]?.image || "/default-profile.png",
                ownerUsername: userDetails[comment.owner]?.username || "Anonymous",
            }));

            setFilteredComments(updatedComments);
        };

        fetchUserDetails();
    }, [comments, postId]);

    // ✅ Like functionality with real-time UI update
    const likeCommentAndUpdate = async (commentId: string) => {
        await likeComment(commentId);
        setFilteredComments(filteredComments.map(comment =>
            comment._id === commentId ? { ...comment, likes: (comment.likes || 0) + 1 } : comment
        ));
    };

    return { data: filteredComments, isLoading, error, like: likeCommentAndUpdate };
};

export default useComments;
