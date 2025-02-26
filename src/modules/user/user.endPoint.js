import { roles } from "../../DB/models/eumsValues/user.enum.js"
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