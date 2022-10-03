import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { ApiProperty, ApiTags } from '@nestjs/swagger';
import { CreateBookDTO } from './dto';
import { BookService } from './service/book.service';

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
}
