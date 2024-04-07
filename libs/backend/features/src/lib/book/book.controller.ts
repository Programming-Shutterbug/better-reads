import { Controller, Get, Param, Post, Delete, Put, Body, Patch } from '@nestjs/common';
import { BookService } from '../book.service';
import { Neo4Service } from '../neo.service';
import { IBook, Leesstatus } from '@nx-emma-indiv/shared/api';
import { CreateBookDto, UpdateBookDto } from '@nx-emma-indiv/backend/dto';

@Controller('book')
export class BookController {
    constructor(
      private bookService: BookService,
      private neoService: Neo4Service,
    ) {}

    // Vind alle boeken
    @Get('')
    async getAll(): Promise<IBook[]> {
        return await this.bookService.findAll();
    }

    // Vind specifiek boek op id
    @Get(':_id')
    async getOne(@Param('_id') _id: string): Promise<IBook | null> {
        return await this.bookService.findOne(_id);
    }

    // Vind aanbevelingen voor specifiek boek op id
    @Get(':_id/recommendations')
    async getRecommendations(@Param('_id') boekId: string): Promise<IBook[]> {
      return await this.neoService.findRecommendationsBook(boekId);
    }

    // Maak een nieuw boek aan
    @Post('')
    async create(@Body() createBookDto: CreateBookDto): Promise<IBook> {
      const createdBook = await this.bookService.createBook(createBookDto);
      return createdBook;
    }
    
    // Update bestaand boek
    @Put(':id')
    async update(@Param('id') bookId: string, @Body() updateBookDto: UpdateBookDto) {
      const updatedBook = await this.bookService.update(bookId, updateBookDto);
      return { message: 'book updated successfully', book: updatedBook };
    }
    
    //Verwijder boek
    @Delete('/:_id')
    async delete(@Param('_id') _id: string): Promise<void> {
      await this.bookService.deleteBook(_id);
    }

    // Voeg boek aan boekenlijst toe
    @Post('/:boekId/:userId/booklist')
    async addBookBooklist(@Param('userId') userId: string, @Body() { boekId, leesstatus }: { boekId: IBook; leesstatus: Leesstatus },): Promise<void> {
      const bookId: IBook = boekId;
      await this.bookService.addBookBooklist(userId, bookId, leesstatus);
    }

    // Update leeslijst van bestaande boek
    @Put('/:boekId/:userId/booklist')
    async updateLeesstatus(@Param('userId') userId: string, @Body() { boekId, leesstatus }: { boekId: IBook; leesstatus: Leesstatus },): Promise<void> {
      await this.bookService.updateLeesstatus(userId, boekId, leesstatus);
    }
    
    // Verwijder boek van boekenlijst
    @Delete('/:boekId/:userId/booklist')
    async removeBookBookList(@Param('boekId') boekId: IBook, @Param('userId') userId: string,): Promise<void> {
      await this.bookService.removeBookBookList(userId, boekId);
    }
}
