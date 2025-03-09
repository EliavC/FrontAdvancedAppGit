import { useEffect, useState } from "react";
import postService, { CanceledError, Post } from "../services/post-service";


const usePosts = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [error, setError] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState<boolean>(false)

    useEffect(() => {
        console.log("Effect")
        setIsLoading(true)
        const { request, abort } = postService.getAllPosts()
        request
            .then((res) => {
                setPosts(res.data)
                setIsLoading(false)
            })
            .catch((error) => {
                if (!(error instanceof CanceledError)) {
                    setError(error.message)
                    setIsLoading(false)
                }
            })
        return abort
    }, [])
    return { posts, setPosts, error, setError, isLoading, setIsLoading }
}

export default usePosts;