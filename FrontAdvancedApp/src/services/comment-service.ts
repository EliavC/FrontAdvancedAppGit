import  { CanceledError } from "./api-client"
import BaseService from "./base-service"


export { CanceledError }////////// mabye delete

export interface Comment {
    _id?: string,
    postId: string,
    owner: string,
    comment: string,//text
    likes: string[]; // New field for like counter
    ownerImage?: string; // ✅ Add this field
    ownerUsername?: string; // ✅ Add this field
}
const CommentService = new BaseService<Comment>("comments");

export default CommentService;