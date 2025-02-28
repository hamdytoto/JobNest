import User from "../../DB/models/user.model.js";
import Company from "../../DB/models/company.model.js";

export const resolvers = {
    getAllData: async () => {
        const users = await User.find();
        const companies = await Company.find();
        return { users, companies };
    },
};
