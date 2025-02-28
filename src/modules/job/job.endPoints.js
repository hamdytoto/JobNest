import { roles } from "../../DB/models/eumsValues/user.enum.js";

const endPoint = {
    createJob:[roles.user],
    updateJob:[roles.user],
    deleteJob:[roles.user,roles.admin],
    getJobs:[roles.user],
    getFilteredJobs:[roles.user],
    getJobApplications:[roles.user],
    applyForJob:[roles.user],
    acceptOrRejectApplication:[roles.user]


   
}

export default endPoint