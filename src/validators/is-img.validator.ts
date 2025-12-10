import { FileValidator } from '@nestjs/common';



export class IsImgValidator extends FileValidator {
  constructor() {
    super({});
  }

  isValid(file: Express.Multer.File): boolean {
    const allowedTypes = ['image/png','image/jpeg', 'image/jpg','image/webp']
   
    
    return allowedTypes.includes(file.mimetype)
  }

  buildErrorMessage(): string {
    return 'Only valid image types are allowed (png, jpeg, jpg, webp)';
  }
}
