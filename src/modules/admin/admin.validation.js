import joi from "joi";
import { isvalidObjectId } from "../../middlewares/validation.middleware.js";

const genericFunc = (key) => {
    return joi.object({
        [key]: joi.custom(isvalidObjectId).required(),
    });
};
export const banOrUnbanUser = genericFunc("userId");
export const banOrUnbanCompany = genericFunc("companyId");
export const approveCompany = genericFunc("companyId");