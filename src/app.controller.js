import morgan from "morgan";
import connectDB from "./DB/connection.js";
const bootstrap = async(app,express) =>{
    await connectDB();
    app.use(morgan("dev"));
}