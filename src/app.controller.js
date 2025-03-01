import morgan from "morgan";
import connectDB from "./DB/connection.js";
import helmet from "helmet"
import cors from "cors"
import globalErrorHandler from "../src/utils/errors/globalError.js";
import notFoundHandler from "./utils/errors/notFoundHandler.js";
import authRouter from "./modules/auth/auth.controller.js";
import userRouter from "./modules/user/user.controller.js"
import jobRouter from "./modules/job/job.controller.js"
import companyRouter from "./modules/company/company.controller.js"
import adminRouter from "./modules/admin/admin.controller.js"
import { allowed } from "./middlewares/cors.middleware.js";
const bootstrap = async(app,express) =>{
    await connectDB();
    app.use(cors());
    app.use(helmet());
    // app.use(allowed)
    app.use(morgan("dev"));
    app.use(express.json());
    app.use("/v1/auth",authRouter)
    app.use("/v1/user",userRouter)
    app.use("/v1/company",companyRouter)
    app.use("/v1/job",jobRouter)
    app.use("/v1/admin",adminRouter)
    app.all("*", notFoundHandler);
    app.use(globalErrorHandler);

};
export default bootstrap