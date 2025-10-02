import AWS from "aws-sdk";
import dotenv from "dotenv";

dotenv.config();

// Configure AWS S3
const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_KEY,
  region: process.env.AWS_REGION,
});

export const uploadToS3 = async (fileBuffer: Buffer, fileName: string, folder: string): Promise<string> => {
    return new Promise((resolve, reject) => {
      s3.upload(
        {
          Bucket: process.env.AWS_BUCKET_NAME!,
          Key: `${folder}/${Date.now()}-${fileName}`,
          Body: fileBuffer,
          ContentType: "image/jpeg",
          ACL: "public-read",
        },
        (err, data) => {
          if (err) reject(err);
          else resolve(data.Location); // ✅ Now TypeScript knows it's a string
        }
      );
    });
  };
  
