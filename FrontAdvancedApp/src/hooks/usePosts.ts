// usePosts.ts
import { useEffect, useState } from "react";
import useData from "./useData";
import PostService, { Post } from "../services/post-service";
import { getUserImgById, getUserNameById } from "../services/user_service";
import CommentService from "../services/comment-service";

interface PostWithDetails extends Post {
  ownerImage?: string;
  ownerUsername?: string;
  commentCount?: number;
}

const usePosts = () => {
  // This uses the generic hook with PostService
  // Note: "like" here toggles the "likes" array in the DB
  const { data: posts, isLoading, error, like } = useData<Post>(PostService);
  const [postsWithDetails, setPostsWithDetails] = useState<PostWithDetails[]>([]);

  useEffect(() => {
    const fetchDetails = async () => {
      if (!posts || posts.length === 0) return;

      const userDetails: { [key: string]: { image?: string; username?: string } } = {};
      const commentCounts: { [key: string]: number } = {};

      await Promise.all(
        posts.map(async (post) => {
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

          // Get comment count for each post
          const comments = await CommentService.getAll();
          commentCounts[post._id ?? ""] =
            comments?.data?.filter((c: any) => c.postId === post._id).length || 0;
        })
      );

      const updatedPosts: PostWithDetails[] = posts.map((post) => ({
        ...post,
        ownerImage: userDetails[post.owner]?.image || "/default-profile.png",
        ownerUsername: userDetails[post.owner]?.username || "Secret Spy",
        commentCount: commentCounts[post._id ?? ""] || 0,
      }));

      setPostsWithDetails(updatedPosts);
    };

    fetchDetails();
  }, [posts]);

  // Return the extended data plus like function
  return { data: postsWithDetails, isLoading, error, like };
};

export default usePosts;
