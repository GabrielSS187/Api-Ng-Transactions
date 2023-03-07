import multer from "multer";

export interface IAwsS3Adapter {
  getSaveFile: multer.StorageEngine;
  getDeleteFile: (fileName: string) => void;
};