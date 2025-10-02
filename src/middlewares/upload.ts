import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/env";

// Configure Cloudinary storage
const storage = new CloudinaryStorage({
    cloudinary,
    params: async (req, file) => ({
      folder: "products", // Cloudinary folder name
      format: file.mimetype.split("/")[1], // Get the file format dynamically
      public_id: `${Date.now()}-${Math.round(Math.random() * 1e9)}`, // Unique filename
     
    }),
  });

// Configure Multer
const upload = multer({ storage });

// Middleware to handle multiple image uploads
export const uploadTaskImage = upload.fields([
  { name: "thumb", maxCount: 1 },   // Single thumbnail
  { name: "gallary", maxCount: 5 }, // Up to 5 gallery images
]);

export default upload;
