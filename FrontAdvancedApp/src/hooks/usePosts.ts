import { useEffect, useState } from "react";
import useData from "./useData";
import PostService from "../services/post-service";
import { Post } from "../services/post-service";
import { getUserImgById } from "../services/user_service";

// ✅ Define a new type that extends `Post` with `ownerImage`
interface PostWithImage extends Post {
    ownerImage?: string;
}

const usePosts = () => {
    const { data: posts, isLoading, error, like } = useData<Post>(PostService);
    const [postsWithUserImages, setPostsWithUserImages] = useState<PostWithImage[]>([]);

    useEffect(() => {
        const fetchUserImages = async () => {
            if (!posts || posts.length === 0) return;

            const userImgUrlsTemp: { [key: string]: string | null } = {};

            await Promise.all(
                posts.map(async (post) => {
                    if (post.owner && !userImgUrlsTemp[post.owner]) {
                        const img = await getUserImgById(post.owner);
                        userImgUrlsTemp[post.owner] = img || "/default-profile.png"; // Fallback avatar
                    }
                })
            );

            // Attach images to posts
            const updatedPosts: PostWithImage[] = posts.map((post) => ({
                ...post,
                ownerImage: userImgUrlsTemp[post.owner] || "/default-profile.png",
            }));

            setPostsWithUserImages(updatedPosts);
        };

        fetchUserImages();
    }, [posts]);

    return { data: postsWithUserImages, isLoading, error, like };
};

export default usePosts;
