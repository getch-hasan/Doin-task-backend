"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadToS3 = void 0;
const aws_sdk_1 = __importDefault(require("aws-sdk"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// Configure AWS S3
const s3 = new aws_sdk_1.default.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_KEY,
    region: process.env.AWS_REGION,
});
const uploadToS3 = async (fileBuffer, fileName, folder) => {
    return new Promise((resolve, reject) => {
        s3.upload({
            Bucket: process.env.AWS_BUCKET_NAME,
            Key: `${folder}/${Date.now()}-${fileName}`,
            Body: fileBuffer,
            ContentType: "image/jpeg",
            ACL: "public-read",
        }, (err, data) => {
            if (err)
                reject(err);
            else
                resolve(data.Location); // ✅ Now TypeScript knows it's a string
        });
    });
};
exports.uploadToS3 = uploadToS3;
