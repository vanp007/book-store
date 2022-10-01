import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import { ApiProperty } from '@nestjs/swagger';
import { CreateBookDTO } from './dto/create-book-dto';
import { BookService } from './service/book.service';

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
  async addBook(@Body() createBookDTO: CreateBookDTO) {
    const book = await this.booksService.addBook(createBookDTO);
    return book;
  }

  @Delete('delete-book')
  async deleteBook(@Query() query) {
    const books = await this.booksService.deleteBook(query.bookID);
    return books;
  }
}
