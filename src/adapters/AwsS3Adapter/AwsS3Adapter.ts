import { IAwsS3Adapter } from "../IAwsS3Adapter";
import { S3Client } from "@aws-sdk/client-s3";
import multerS3 from "multer-s3";
import { S3 } from "aws-sdk";

const s3 = new S3Client({
  region: "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS!,
  },
});

const awsS3 = new S3({
  region: "us-east-1",
  accessKeyId: process.env.AWS_ACCESS_KEY!,
  secretAccessKey: process.env.AWS_SECRET_ACCESS!,
});

export class AwsS3Adapter implements IAwsS3Adapter {
   #saveFile = multerS3({
    s3,
    bucket: process.env.AWS_BUCKET!,
    acl: "public-read",
    contentType: multerS3.AUTO_CONTENT_TYPE,
    key: function (req, file, cb) {  
      cb(null, Date.now().toString() + '-' + file.originalname);
    },
  });

  #deleteFile (fileName: string) {
    awsS3.deleteObject({
      Bucket: process.env.AWS_BUCKET!,
      Key: fileName,
    })
    .promise();
  };

  getSaveFile = this.#saveFile;
  getDeleteFile = (fileName: string) => 
  this.#deleteFile(fileName);
}