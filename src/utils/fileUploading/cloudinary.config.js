import { v2 as cloudinary } from "cloudinary";
cloudinary.config({
	cloud_name: process.env.ClOUD_NAME,
	api_key: process.env.API_KEY,
	api_secret: process.env.API_SECRET,
});
export default cloudinary;
