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

export const cloudUpload = () => {
    const storage = diskStorage({}); // temp folder 

    const multerUpload = multer({ storage});

    return multerUpload; // object
};
