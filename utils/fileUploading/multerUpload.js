import multer, { diskStorage } from "multer";
import { nanoid } from "nanoid";
import path from "path";
import fs from "fs";
// diskStorage  => it will take an object  => save file in file system
// multer
// multer is a middleware function that handles multipart/form-data requests
export const fileValidation = {
	images: ["image/png", "image/jpg", "image/jpeg"],
	files: ["application/pdf", "application/msword"],
};
export const folderNames = {
	profilePics: "profilePics",
	coverPics: "coverPics",
	fieldPics: "fieldPics",
};

export const upload = (fileType, folder) => {
	const storage = diskStorage({
		// destination:"./uploads",
		destination: (req, file, cb) => {
			const folderPath = path.join(
				".",
				`uploads/${folder}/${req.user._id.toString()}`
			);
			fs.mkdir(folderPath, { recursive: true }, (err) => {
				if (err) {
					return cb(err, null);
				}
				cb(null, folderPath);
			});
		},
		filename: (req, file, cb) => {
			// console.log({ file });
			cb(null, nanoid() + "-" + file.originalname);
		},
	});
	const fileFilter = function (req, file, cb) {
		if (!fileType.includes(file.mimetype))
			return cb(
				new Error(`invalid Format we acctept ${JSON.stringify(fileType)}`),
				false
			);
		return cb(null, true);
	};

	const multerUpload = multer({ storage, fileFilter });

	return multerUpload; // object
};
