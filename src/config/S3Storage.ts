// import aws, { S3 } from "aws-sdk";
// import * as mime from "mime";
// import fs from "fs";
// import multerConfig from "./multer";
// import path from "path";

// class S3Storage {
//   #client: S3;

//   constructor() {
//     this.#client = new aws.S3({
//       region: "us-east-1",
//       accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//       secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//     });  
//   };

//   async saveFile(filename: string): Promise<void> {
//     const originalPath = path.resolve(multerConfig.dest!, filename);
    
//     const ContentType = mime.getType(originalPath);

//     if ( !ContentType ) {
//       throw new Error("File not found.");
//     };

//     const fileContent = await fs.promises.readFile(originalPath);

//     this.#client.putObject({
//       Bucket: process.env.AWS_BUCKET!,
//       Key: filename,
//       ACL: "public-read",
//       Body: fileContent,
//       ContentType
//     })
//     .promise();

//     await fs.promises.unlink(originalPath);
//   };
// };

// export default S3Storage;