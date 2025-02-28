import { roles } from "../../DB/models/eumsValues/user.enum.js";

 const companyEndPoint = {
    createCompany:[roles.user,roles.admin],
    updateCompany:[roles.user],
    deleteCompany:[roles.user,roles.admin],
    getCompany:[roles.user],
    serachCompany:[roles.user],
    uploadLogo:[roles.user],
    uploadCover:[roles.user],
    deleteLogo:[roles.user],
    deleteCover:[roles.user]
}
export default companyEndPoint;