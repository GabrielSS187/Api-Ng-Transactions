import { Options } from "multer";
import { AwsS3Adapter } from "../adapters/AwsS3Adapter/AwsS3Adapter";

const awsS3Adapter = new AwsS3Adapter();

export default {
  storage: awsS3Adapter.getSaveFile,
  limits: { fileSize: 8 * 1024 * 1024 }, //* limite de 8 MB
  fileFilter: function (req, file, cb) {
    const mimeType = ["image/png", "image/jpeg", "image/gif", "image/jpg"]

    if  (!mimeType.includes(file.mimetype)) {
      return cb(null, false);
    };

    cb(null, true);
  },
} as Options;