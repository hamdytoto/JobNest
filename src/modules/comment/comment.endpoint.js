import { roles } from "../../DB/models/user.model.js";

 const commentEndPoint = {
    createComment:[roles.user],
    updateComment:[roles.user],
    deleteComment:[roles.user,roles.admin],
    getComments:[roles.user],
    likeUnlikeComment:[roles.user],
    replyComment:[roles.user],
    hardDelete:[roles.admin,roles.user]
}
export default commentEndPoint;