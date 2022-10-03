import { HttpException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateBookDTO } from '../dto';
import { Books } from '../entity';

@Injectable()
export class BookService {
  constructor(
    @InjectRepository(Books) private bookRepository: Repository<Books>,
  ) {}

  //fetching all books
  getBooks() {
    return this.bookRepository.find();
  }

  //fetching book by id
  async getBook(bookID: number) {
    const book = await this.bookRepository.findOne({
      where: { id: bookID },
    });
    if (!book) {
      throw new HttpException('Book does not exist!', 404);
    }
    return book;
  }

  //add a book
  async addBook(bookDetails: CreateBookDTO): Promise<CreateBookDTO> {
    try {
      const findBookAndAuthor = await this.bookRepository.find({
        where: { author: bookDetails.author, title: bookDetails.title },
      });

      //check if author and book exist
      if (findBookAndAuthor.length > 0) {
        console.log(findBookAndAuthor.length);
        throw new HttpException('book and user already exist', 409);
      } else {
        const book = this.bookRepository.create({ ...bookDetails });
        await this.bookRepository.save(book);

        //saving book details
        const registeredBook = {
          title: book.title,
          author: book.author,
          description: book.description,
          createdAt: book.createdAt,
        };
        return registeredBook;
      }
    } catch (error) {
      throw error;
    }
  }

  //delete book by id
  async deleteBook(bookID: number) {
    try {
      const book = await this.bookRepository.delete({ id: bookID });
      return book;
    } catch (error) {
      throw error;
    }
  }
}
