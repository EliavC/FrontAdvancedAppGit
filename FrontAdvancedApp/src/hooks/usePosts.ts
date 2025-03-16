import { useEffect, useState } from "react";
import useData from "./useData";
import PostService from "../services/post-service";
import { Post } from "../services/post-service";
import UserService from "../services/user_service"; // ✅ Import Post Type


const usePosts = () => {
    const { data: posts, isLoading, error, like } = useData<Post>(PostService);
    const [postsWithImages, setPostsWithImages] = useState<Post[]>([]);

    useEffect(() => {
        const fetchUserImages = async () => {
            if (posts.length === 0) return;

            const userIds = [...new Set(posts.map(post => post.owner))]; // ✅ Unique user IDs
            const userImages: { [key: string]: string } = {};

            // Fetch user profile images for each user ID
            await Promise.all(
                userIds.map(async (userId) => {
                    const user = await UserService.getUserById(userId);
                    if (user?.imgUrl) {
                        userImages[userId] = user.imgUrl;
                    }
                })
            );

            // Update posts to include `ownerImage`
            const updatedPosts = posts.map(post => ({
                ...post,
                ownerImage: userImages[post.owner] || "/default-profile.png",
            }));

            setPostsWithImages(updatedPosts);
        };

        fetchUserImages();
    }, [posts]);

    return { data: postsWithImages, isLoading, error, like };
};

export default usePosts;









// const usePosts = () => {
//     return useData<Post>(PostService); // ✅ Ensure Type is Passed
// };

// export default usePosts;



// import { useEffect, useState } from "react";
// import postService, { CanceledError, Post } from "../services/post-service";


// const usePosts = () => {
//     const [posts, setPosts] = useState<Post[]>([]);
//     const [error, setError] = useState<string | null>(null)
//     const [isLoading, setIsLoading] = useState<boolean>(false)

//     useEffect(() => {
//         console.log("Effect")
//         setIsLoading(true)
//         const { request, abort } = postService.getAllPosts()
//         request
//             .then((res) => {
//                 setPosts(res.data)
//                 setIsLoading(false)
//             })
//             .catch((error) => {
//                 if (!(error instanceof CanceledError)) {
//                     setError(error.message)
//                     setIsLoading(false)
//                 }
//             })
//         return abort
//     }, [])
//     return { posts, setPosts, error, setError, isLoading, setIsLoading }
// }

// export default usePosts;