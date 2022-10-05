import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiProperty, ApiTags } from '@nestjs/swagger';
import { CreateBookDTO } from './dto';
import { BookService } from './service/book.service';
import { diskStorage } from 'multer';

@ApiTags('BOOK DATA')
@Controller('book')
export class BookController {
  constructor(private booksService: BookService) {}

  @Get('get-all-books')
  async getBooks() {
    const books = await this.booksService.getBooks();
    return books;
  }

  @Get(':bookID')
  async getBook(@Param('bookID') bookID: number) {
    const book = await this.booksService.getBook(bookID);
    return book;
  }

  @Post('add-book')
  @ApiProperty()
  async addBook(@Body() createBookDTO: CreateBookDTO) {
    const book = await this.booksService.addBook(createBookDTO);
    return book;
  }

  @Delete('delete-book')
  async deleteBook(@Query('bookID') bookID: number) {
    const books = await this.booksService.deleteBook(bookID);
    return books;
  }

  //uploading file
  @ApiProperty()
  @Post('file')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './book_cover',
        filename: (req, file, callback) => {
          const name = file.originalname.split('.')[0];
          const fileExtension = file.originalname.split('.')[1];
          const newFileName =
            name.split(' ').join('_') + '_' + Date.now() + '.' + fileExtension;

          callback(null, newFileName);
        },
      }),
      fileFilter: (req, file, callback) => {
        if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
          return callback(null, false);
        }
        callback(null, true);
      },
    }),
  )
  handleupload(@UploadedFile() file: Express.Multer.File) {
    if (!file) {
      throw new BadRequestException('File is not image!!!');
    } else {
      return file.filename;
    }
  }
}
