import { roles } from "../../DB/models/user.model.js";

const endPoint = {
    createPost:[roles.user],
    updatePost:[roles.user],
    SoftDeletePost:[roles.user,roles.admin],
    restorePost:[roles.user,roles.admin],
    getSinglePost:[roles.user,roles.admin],
    getActivePosts:[roles.admin,roles.user],
    archivedPosts:[roles.admin,roles.user],
    likeUnlikePost:[roles.user]
}

export default endPoint