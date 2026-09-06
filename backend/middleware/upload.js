const multer = require("multer");
const path = require("path");
const crypto = require("crypto");

const storage = multer.diskStorage({
    destination: path.resolve(__dirname, "../uploads"),
    filename: (req, file, callback) => {
        const extension = path.extname(file.originalname).toLowerCase();
        callback(null, `${Date.now()}-${crypto.randomBytes(8).toString("hex")}${extension}`);
    }
});

const fileFilter = (req, file, callback) => {
    const acceptedTypes = ["application/pdf", "image/jpeg", "image/png"];
    if (!acceptedTypes.includes(file.mimetype)) {
        return callback(new Error("Formats acceptés : PDF, JPG et PNG."));
    }
    callback(null, true);
};

const uploadPieceJointe = multer({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }
});

module.exports = { uploadPieceJointe };
