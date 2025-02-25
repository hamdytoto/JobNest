import mongoose from "mongoose";

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.CONNECTION_URL); 
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error.message);
    }

};

export default connectDB