import express from "express";
import bootstrap from "./src/app.controller.js";
import chalk from "chalk";
import dotenv from "dotenv";
import { Server } from "socket.io";
dotenv.config();
const app = express();
const port = process.env.PORT;
bootstrap(app, express);
const server = app.listen(port, () => {
	console.log(
		chalk.red.bgGreen.underline.bold(`Example app listening on port ${port}!`)
	);
});

// Socket Connection 
const io = new Server(server, {
	cors: {
		origin: "*",
	},
});
