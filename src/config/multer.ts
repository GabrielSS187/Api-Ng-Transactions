import multer, { Options } from "multer";
import path from "path";

// const tmpFolder = path.join(process.env.TMPDIR!, "uploads");

export default {
  storage: multer.memoryStorage(),
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
