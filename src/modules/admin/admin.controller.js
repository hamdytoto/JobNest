import { Router } from "express";
import { createHandler } from "graphql-http/lib/use/express";
import expressPlayground from "graphql-playground-middleware-express";
import { schema } from "./schema.js";
import { resolvers } from "./resolvers.js";
import isAuthenticated from "../../middlewares/auth.middleware.js";
import { isAdmin } from "../../middlewares/isAdmin.middleware.js";
import {
	approveCompany,
	banOrUnbanCompany,
	banOrUnbanUser,
} from "./admin.services.js";
import validation from "../../middlewares/validation.middleware.js";
import * as adminValidation from "../admin/admin.validation.js";
import { generateApplicationsReport } from "../../utils/reports/generateReport.js";
const router = Router();
router.use(
	"/graphql",
	createHandler({
		schema,
		rootValue: resolvers,
		graphiql: true,
		context: (req) => {
			const { authorization } = req.headers;
			return { authorization };
		},
	})
);
router.get(
	"/doc",
	expressPlayground.default({ endpoint: "/v1/admin/graphql" })
);
//http://localhost:3000/v1/admin/doc

// admin actions
router.put(
	"/ban-user/:userId",
	isAuthenticated,
	isAdmin,
	validation(adminValidation.banOrUnbanUser),
	banOrUnbanUser
);
router.put(
	"/ban-company/:companyId",
	isAuthenticated,
	isAdmin,
	validation(adminValidation.banOrUnbanCompany),
	banOrUnbanCompany
);
router.put(
	"/approve-company/:companyId",
	isAuthenticated,
	isAdmin,
	validation(adminValidation.approveCompany),
	approveCompany
);
router.get(
	"/application_report/:companyId/:date",
	// isAuthenticated,
	// isAdmin,
	validation(adminValidation.generateApplicationsReport),
	generateApplicationsReport
);
export default router;
