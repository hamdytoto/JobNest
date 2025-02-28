import { roles } from "../DB/models/eumsValues/user.enum.js";
export const isAdmin = (req, res, next) => {
    if (req.user.role !== roles.admin) {
        return res.status(403).json({ success: false, message: "Access denied. Admins only." });
    }
    next();
};