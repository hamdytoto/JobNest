import { roles } from "../../DB/models/user.model.js"

export const adminEndPoints ={
    getAllUsers:[roles.admin],
    changeRole:[roles.admin,roles.superAdmin]

}