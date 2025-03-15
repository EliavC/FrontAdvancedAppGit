import useData from "./useData";
import CommentService, { Comment } from "../services/comment-service";

const useComments = () => {
    return useData<Comment>(CommentService);
};

export default useComments;
