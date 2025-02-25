import { roles } from "../../DB/models/user.model.js"
const endPoints={
    profile:[roles.user,roles.admin],
    updateProfile:[roles.user],
    updatePassword:[roles.user],
    deactiveAccount:[roles.user,roles.admin],
    forgotPassword:[roles.user],
    resetPassword:[roles.user],
    updateEmail:[roles.user],
}

export default endPoints;