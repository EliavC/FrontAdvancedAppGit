import { useEffect, useState } from "react";
import useData from "./useData";
import PostService from "../services/post-service";
import { Post } from "../services/post-service";
import { getUserImgById, getUserNameById } from "../services/user_service";

// ✅ Define a single interface that includes both `ownerImage` and `ownerUsername`
interface PostWithDetails extends Post {
    ownerImage?: string;
    ownerUsername?: string;
}

const usePosts = () => {
    const { data: posts, isLoading, error, like } = useData<Post>(PostService);
    const [postsWithDetails, setPostsWithDetails] = useState<PostWithDetails[]>([]);

    useEffect(() => {
        const fetchUserDetails = async () => {
            if (!posts || posts.length === 0) return;

            const userDetails: { [key: string]: { image?: string; username?: string } } = {};

            await Promise.all(
                posts.map(async (post) => {
                    if (post.owner && !userDetails[post.owner]) {
                        const [img, username] = await Promise.all([
                            getUserImgById(post.owner),
                            getUserNameById(post.owner),
                        ]);

                        userDetails[post.owner] = {
                            image: img || "/default-profile.png", // Fallback avatar
                            username: username || "Secret Spy", // Default name
                        };
                    }
                })
            );

            // Attach details to posts
            const updatedPosts: PostWithDetails[] = posts.map((post) => ({
                ...post,
                ownerImage: userDetails[post.owner]?.image || "/default-profile.png",
                ownerUsername: userDetails[post.owner]?.username || "Secret Spy",
            }));

            setPostsWithDetails(updatedPosts);
        };

        fetchUserDetails();
    }, [posts]);

    return { data: postsWithDetails, isLoading, error, like };
};

export default usePosts;
