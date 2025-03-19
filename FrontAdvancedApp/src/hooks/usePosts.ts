import { useEffect, useState } from "react";
import useData from "./useData";
import PostService from "../services/post-service";
import { Post } from "../services/post-service";
import { getUserImgById, getUserNameById } from "../services/user_service";
import CommentService from "../services/comment-service";

interface PostWithDetails extends Post {
    ownerImage?: string;
    ownerUsername?: string;
    commentCount?: number;
}

const usePosts = (userId?: string) => {
    const { data: posts, isLoading, error, like } = useData<Post>(PostService);
    const [postsWithDetails, setPostsWithDetails] = useState<PostWithDetails[]>([]);

    useEffect(() => {
        const fetchDetails = async () => {
            if (!posts || posts.length === 0) return;

            let filteredPosts = userId ? posts.filter(post => post.owner === userId) : posts;

            const userDetails: { [key: string]: { image?: string; username?: string } } = {};
            const commentCounts: { [key: string]: number } = {};

            await Promise.all(
                filteredPosts.map(async (post) => {
                    if (post.owner && !userDetails[post.owner]) {
                        const [img, username] = await Promise.all([
                            getUserImgById(post.owner),
                            getUserNameById(post.owner),
                        ]);

                        userDetails[post.owner] = {
                            image: img || "/default-profile.png",
                            username: username || "Secret Spy",
                        };
                    }

                    const comments = await CommentService.getAll();
                    commentCounts[post._id ?? ""] = comments?.data?.filter(c => c.postId === post._id).length || 0;
                })
            );

            const updatedPosts: PostWithDetails[] = filteredPosts.map((post) => ({
                ...post,
                ownerImage: userDetails[post.owner]?.image || "/default-profile.png",
                ownerUsername: userDetails[post.owner]?.username || "Secret Spy",
                commentCount: commentCounts[post._id ?? ""] || 0,
            }));

            setPostsWithDetails(updatedPosts);
        };

        fetchDetails();
    }, [posts, userId]);

    return { data: postsWithDetails, isLoading, error, like };
};

export default usePosts;
