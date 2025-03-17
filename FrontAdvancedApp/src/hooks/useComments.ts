import { useEffect, useState } from "react";
import useData from "./useData";
import { Comment } from "../services/comment-service";
import { getUserImgById } from "../services/user_service";
import CommentService from "../services/comment-service";

// ✅ Define a new type that extends `Post` with `ownerImage`
interface CommentWithImage extends Comment {
    ownerImage?: string;
}

const useComments = () => {
    const { data: comments, isLoading, error, like } = useData<Comment>(CommentService);
    const [commentsWithUserImages, setCommentsWithUserImages] = useState<CommentWithImage[]>([]);

    useEffect(() => {
        const fetchUserImages = async () => {
            if (!comments || comments.length === 0) return;

            const userImgUrlsTemp: { [key: string]: string | null } = {};

            await Promise.all(
                comments.map(async (comment) => {
                    if (comment.owner && !userImgUrlsTemp[comment.owner]) {
                        const img = await getUserImgById(comment.owner);
                        userImgUrlsTemp[comment.owner] = img || "/default-profile.png"; // Fallback avatar
                    }
                })
            );

            // Attach images to posts
            const updatedComments: CommentWithImage[] = comments.map((comment) => ({
                ...comment,
                ownerImage: userImgUrlsTemp[comment.owner] || "/default-profile.png",
            }));

            setCommentsWithUserImages(updatedComments);
        };

        fetchUserImages();
    }, [comments]);

    return { data: commentsWithUserImages, isLoading, error, like };
};

export default useComments;
