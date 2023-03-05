import multer, { Options } from "multer";
import { S3Client } from "@aws-sdk/client-s3"
import aws from "aws-sdk";
import multerS3 from "multer-s3";
import path from "path";

// export const tmpFolder = path.resolve("src/uploads/imgs");

const s3 = new S3Client({
  region: "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
});

export const upload = multer({
  storage: multerS3({
    s3,
    bucket: process.env.AWS_BUCKET!,
    acl: "public-read",
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: function (req, file, cb) {
      cb(null, Date.now().toString() + '-' + file.originalname);
    },
  }),
  limits: { fileSize: 8 * 1024 * 1024 }, //* limite de 8 MB
  fileFilter: function (req, file, cb) {
    const mimeType = ["image/png", "image/jpeg", "image/gif", "image/jpg"]

    if  (mimeType.includes(file.mimetype) ) {
      return cb(null, false);
    };

    cb(null, true);
  },
});