//import apiClient, { CanceledError } from "./api-client"
import BaseService from "./base-service"


//export { CanceledError }

export interface Comment {
    _id?: string,
    postId: string,
    owner: string,
    comment: string,//text
    likes: number; // New field for like counter
}
const CommentService = new BaseService<Comment>("comments");

export default CommentService;