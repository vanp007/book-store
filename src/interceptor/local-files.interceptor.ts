import { FilesInterceptor } from '@nestjs/platform-express';
import { Injectable, mixin, NestInterceptor, Type } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MulterOptions } from '@nestjs/platform-express/multer/interfaces/multer-options.interface';
import { diskStorage } from 'multer';

interface LocalFilesInterceptorOptions {
  fieldName: string;
  maxCount?: number;
  path?: string;
  fileFilter?: MulterOptions['fileFilter'];
  limits?: MulterOptions['limits'];
}

export function LocalFilesInterceptor(
  options: LocalFilesInterceptorOptions,
): Type<NestInterceptor> {
  @Injectable()
  class Interceptor implements NestInterceptor {
    filesInterceptor: NestInterceptor;

    constructor(configService: ConfigService) {
      const filesDestination = configService.get('MULTER_DEST');

      const destination = `${filesDestination}${options.path}`;
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

      this.filesInterceptor = new (FilesInterceptor(
        options.fieldName,
        options.maxCount,
        multerOptions,
      ))();
    }

    intercept(...args: Parameters<NestInterceptor['intercept']>) {
      return this.filesInterceptor.intercept(...args);
    }
  }

  return mixin(Interceptor);
}
