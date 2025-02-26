import { roles } from "../../DB/models/eumsValues/user.enum.js"
const endPoints={
    profile:[roles.user,roles.admin],
    profileUser:[roles.user,roles.admin],
    updateProfile:[roles.user],
    updatePassword:[roles.user],
    deactiveAccount:[roles.user,roles.admin],
}

export default endPoints;