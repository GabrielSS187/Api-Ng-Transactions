import S3Storage from "./S3Storage";

class UploadImages {
  async execute(file: Express.Multer.File) {
    const s3Storage = new S3Storage();

    await s3Storage.saveFile(file.filename);
  }
};

export default UploadImages;