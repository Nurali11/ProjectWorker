import { BadRequestException, Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { ApiBody, ApiConsumes } from '@nestjs/swagger';
import type { File as MulterFile } from 'multer';

@Controller('file')
export class MulterController {
  @Post()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, callback) => {
          callback(null, `${Date.now()}${file.originalname}`);
        },
      }),
    }),
  )
  uploadFile(@UploadedFile() file: MulterFile) {
    if (!file) {
      throw new BadRequestException('Send file please');
    }

    return { url: `uploads/${file.filename}` };
  }

}