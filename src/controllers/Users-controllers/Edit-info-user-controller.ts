import { Request, Response } from "express";

import { CreateUsersRepository } 
from "../../repositories/Users-repository";
import { EditInfoUserCase } from "../../use-cases/Users-cases/Edit-info-user-case";

import { BCryptAdapter } from "../../adapters/Bcrypt-adapter/Bcrypt-adapter";
// import UploadImages from "../../config/UploadImages";

 export class EditInfoUserController {
  async edit (req: Request, res: Response) {
    const idUser = req.userId as number;
    let photo_url: string | undefined;
    
    // const uploadImages = new UploadImages();
    if ( req.file ) {
      const requestImage: any = req.file as Express.Multer.File
      const image = requestImage.key!;
      // await uploadImages.execute(requestImage);
      photo_url = `${process.env.AWS_URL}/${image}`; 
    };
    
    const { 
      user_name,
      user_email,
      password_hash,
      verify,
     } = req.body;

     const createUsersRepository = new CreateUsersRepository();
     const bcryptAdapter = new BCryptAdapter();

     const editInfoUserCase =
     new EditInfoUserCase(
      createUsersRepository, 
      bcryptAdapter
    );

     const result = await editInfoUserCase.edit({
        photo_url,
        user_name,
        user_email,
        password_hash,
        verify,
     }, idUser);

     return res.status(result.statusCode).json(result.message);
  };
 };