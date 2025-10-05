"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadTaskImage = void 0;
const multer_1 = __importDefault(require("multer"));
const multer_storage_cloudinary_1 = require("multer-storage-cloudinary");
const env_1 = __importDefault(require("../config/env"));
// Configure Cloudinary storage
const storage = new multer_storage_cloudinary_1.CloudinaryStorage({
    cloudinary: env_1.default,
    params: async (req, file) => ({
        folder: "products", // Cloudinary folder name
        format: file.mimetype.split("/")[1], // Get the file format dynamically
        public_id: `${Date.now()}-${Math.round(Math.random() * 1e9)}`, // Unique filename
    }),
});
// Configure Multer
const upload = (0, multer_1.default)({ storage });
// Middleware to handle multiple image uploads
exports.uploadTaskImage = upload.fields([
    { name: "thumb", maxCount: 1 }, // Single thumbnail
    { name: "gallary", maxCount: 5 }, // Up to 5 gallery images
]);
exports.default = upload;
