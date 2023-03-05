import multer, { Options } from "multer";
import path from "path";

export const tmpFolder = path.resolve("src/uploads/imgs");

export default {
  dest: tmpFolder,
  storage: multer.diskStorage({
    destination: tmpFolder,
    filename(req, file, callback) {
      callback(null, `${Date.now()}-${file.originalname}`)
    }
  }),
  limits: {
    fileSize: 8 * 1024 * 1024 //* 8MB
  },
  fileFilter: (req, file, callback) => {
    const mimeType = ["image/png", "image/jpeg", "image/gif", "image/jpg"]

    if ( !mimeType.includes(file.mimetype) ) {
      return callback(null, false)
    };

    callback(null, true);
  }
} as Options;