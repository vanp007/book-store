import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BookController } from './book.controller';
import { BookService } from './service/book.service';
import { Books } from './entity';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from 'src/auth/auth.module';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    ConfigModule,
    AuthModule,
    TypeOrmModule.forFeature([Books]),
    MulterModule.register({ dest: './book_cover' }),
  ],
  controllers: [BookController],
  providers: [BookService],
})
export class BookModule {}
