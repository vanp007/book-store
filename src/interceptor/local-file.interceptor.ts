import { FileInterceptor } from '@nestjs/platform-express';
import { Injectable, mixin, NestInterceptor, Type } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { diskStorage } from 'multer';

interface LocalFileInterceptorOptions {
  fieldName: string;
  path?: string;
  fileFilter?: MulterOptions['fileFilter'];
  limits?: MulterOptions['limits'];
}

export function LocalFileInterceptor(
  options: LocalFileInterceptorOptions,
): Type<NestInterceptor> {
  @Injectable()
  class Interceptor implements NestInterceptor {
    fileInterceptor: NestInterceptor;

    constructor(configService: ConfigService) {
      const fileDestination = configService.get('MULTER_DEST');

      const destination = `${fileDestination}${options.path}`;
      const filename = (_req, file, callback) => {
        const name = file.originalname.split('.')[0];
        const fileExtName = file.originalname.split('.')[1];
        callback(null, `${name}.${fileExtName}`);
      };

      const multerOptions: MulterOptions = {
        storage: diskStorage({
          destination,
          filename,
        }),
        fileFilter: options.fileFilter,
        limits: options.limits,
      };

      this.fileInterceptor = new (FileInterceptor(
        options.fieldName,
        multerOptions,
      ))();
    }

    intercept(...args: Parameters<NestInterceptor['intercept']>) {
      return this.fileInterceptor.intercept(...args);
    }
  }

  return mixin(Interceptor);
}
