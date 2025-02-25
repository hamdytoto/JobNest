const  isAuthrized = (...roles )=>{
    return (req, res, next) => {
        if (!roles.includes(req.user.role) ) {
            return next(new Error(" You are not authorized", { cause: 401 }));
        }
        return next();
    }
}   

export default isAuthrized;