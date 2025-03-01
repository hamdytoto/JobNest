import rateLimit from "express-rate-limit";

// Rate limiter settings (e.g., 100 requests per 15 minutes)
const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: {
        success: false,
        message: "Too many requests from this IP, please try again later.",
    },
    headers: true,
});

export default apiLimiter;
