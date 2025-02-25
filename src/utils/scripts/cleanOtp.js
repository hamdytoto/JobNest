import cron from "node-cron"
import  mongoose from "mongoose";
import 'dotenv/config'
import User  from "../../DB/models/user.model.js";
// Connect to MongoDB
const DBLink = process.env.CONNECTION_URL;
console.log(DBLink);
mongoose.connect(DBLink, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Function to clean up expired OTPs
const cleanupExpiredOtps = async () => {
    try {
        console.log('Running OTP cleanup job...');
        const now = new Date();
        // Remove expired OTPs from all users
        await User.updateMany(
            {}, // Match all users
            { $pull: { otps: { expireIn: { $lt: now } } } } // Remove OTPs where expireIn < now
        );

        console.log('Expired OTPs cleaned up.');
    } catch (error) {
        console.error('Error during OTP cleanup:', error);
    } finally {
        // Disconnect from MongoDB
        mongoose.disconnect();
    }
};

cron.schedule('0 */6 * * *', () => {
    console.log('Starting scheduled OTP cleanup...');
    cleanupExpiredOtps();
});