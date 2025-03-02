import express from "express";
import bootstrap from "./src/app.controller.js";
import chalk from "chalk";
import dotenv from "dotenv";
import { Server } from "socket.io";
dotenv.config();
const app = express();
const port = process.env.PORT;
bootstrap(app, express);
export const server = app.listen(port, () => {
	console.log(
		chalk.red.bgGreen.underline.bold(`Example app listening on port ${port}!`)
	);
});

// Socket Connection 
// const io = new Server(server, {
// 	cors: {
// 		origin: "*",
// 	},
// });
// io.on("connection", (socket) => {
// 	console.log(socket.id);
// 	console.log("a user connected");
// 	io.emit("products",[{name:"Product 1",price:10},{name:"Product 2",price:20}]);

// 	socket.on("cars",(data)=>{
// 		console.log(data);
// 	})
// })


