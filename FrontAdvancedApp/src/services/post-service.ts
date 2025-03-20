//import apiClient, { CanceledError } from "./api-client"
import BaseService from "./base-service"


//export { CanceledError }

export interface Post  {
    _id?: string,
    title: string,
    content: string,
    owner: string,
    likes: string[],
    imgUrlPost?: string,
    commentCount?: number,

}

const PostService = new BaseService<Post>("posts");



export default PostService;




// const getAllPosts = () => {
//     const abortController = new AbortController()
//     const request = apiClient.get<Post[]>("/posts"
//         , { signal: abortController.signal })
//     return { request, abort: () => abortController.abort() }
// }
// export default { getAllPosts }