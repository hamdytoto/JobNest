import Company from "../../../DB/models/company.model.js";
import cloudinary from "../../../utils/fileUploading/cloudinary.config.js";
export const fieldNames={
    logo:"logo",
    coverPic:"coverPic"
}
export const updateCompanyFile = async (req, res, next, fieldName) => {
    const { id } = req.params;

    const company = await Company.findById(id);
    if (!company) return next(new Error("Company not found", { cause: 404 }));

    //  Ensure only the owner can upload/delete
    if (company.createdBy.toString() !== req.user._id.toString()) {
        return next(new Error(`Unauthorized: Only the owner can update the ${fieldName}.`, { cause: 403 }));
    }
    let message = "deleted";
    //  Delete existing file if it exists
    if (company[fieldName]?.public_id) {
        await cloudinary.uploader.destroy(company[fieldName].public_id);
    }

    //  Upload new file if present
    if (req.file) {
        const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, {
            folder: `${process.env.CLOUD_FOLDER}/company/${fieldName}/${company._id}`
        });

        company[fieldName] = { secure_url, public_id };
        message = "uploaded";
    } else {
        company[fieldName] = { secure_url: null, public_id: null }; // Removing file
    }

    await company.save();
    res.status(200).json({ success: true, message: `${fieldName} ${message} successfully`, results: { company } });
};
