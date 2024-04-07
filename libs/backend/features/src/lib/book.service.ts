import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Book as BookModel, BookDocument } from './book/book.schema';
import { User as UserModel, UserDocument } from './user/user.schema';
import { IBook, IUser, Leesstatus } from '@nx-emma-indiv/shared/api';
import { CreateBookDto, UpdateBookDto } from '@nx-emma-indiv/backend/dto';
import { WriterService } from './writer.service';
import { Neo4Service } from './neo.service';

@Injectable()
export class BookService {
        private readonly logger: Logger = new Logger(BookService.name);

        constructor(
            @InjectModel(BookModel.name) private bookModel: Model<BookDocument>,
            @InjectModel(UserModel.name) private userModel: Model<UserDocument>,
            private readonly writerService: WriterService,
            private readonly neo4jService: Neo4Service
        ) {}

        async findAll(): Promise<IBook[]> {
            this.logger.log(`Finding all books`);
            
            // Gebruikt populate om de schrijver samen met boek op te halen 
            const items = await this.bookModel.find().populate('schrijver');
            
            return items;
        }
        

        async findOne(_id: string): Promise<IBook | null> {
            this.logger.log(`finding book with id ${_id}`);
        
            // Kijk of id null is
            if (_id === null || _id === "null") {
                this.logger.debug('ID is null or "null"');
                return null;
            }

            // Gebruikt populate om de schrijver details samen met boek op te halen 
            const item = await this.bookModel.findOne({ _id: _id }).populate('schrijver').exec();
        
            if (!item) {
                this.logger.debug('Item not found');
            }
        
            return item;
        }
        

        async createBook(bookDto: CreateBookDto): Promise<IBook> {
            this.logger.log(`New book is created`);

            // Haal het "_id" en "schrijver" veld uit het boekDto object.
            const { _id, schrijver, ...bookWithoutWriter } = bookDto;
        
            // Voeg de schrijver expliciet toe aan het boek
            const bookData = {
            ...bookWithoutWriter,
            schrijver: schrijver,
            };
            const createdBook = await this.bookModel.create(bookData);

            this.logger.log(createdBook.schrijver._id);

            this.neo4jService.addOrUpdateBook(createdBook, createdBook.schrijver._id);

            return createdBook;
        }
        
        
        async update(bookId: string, updateBookDto: UpdateBookDto): Promise<IBook> {
            this.logger.log(`Update book ${bookId}`)

            // Zoek het bestaande boek in de database op basis van het opgegeven boekId.
            const existingBook = await this.bookModel.findById(bookId).exec();
        
            if (!existingBook) {
            throw new NotFoundException(`Book with id ${bookId} not found`);
            }
        
            // Update book eigenschappen
            Object.assign(existingBook, updateBookDto);
        
            // Sla geupdate boek op
            const updatedBook = await existingBook.save();

            
            this.neo4jService.addOrUpdateBook(updatedBook, updatedBook.schrijver._id);
        
            return updatedBook;
        }
    

        async deleteBook(_id: string): Promise<void> {
        this.logger.log(`Deleting Book with id ${_id}`);

        const book = await this.findOne(_id);

        if(book) {
            await this.bookModel.deleteOne(book).exec();
        }
        else {
            this.logger.debug('Book not found for deletion');
            throw new NotFoundException(`Book with _id ${_id} not found`);
        }

        this.neo4jService.deleteBook(book);


        this.logger.log(`Book deleted successfully`);
        }

        async addBookBooklist(userId: string, bookId: IBook, leesstatus: Leesstatus): Promise<IUser> {
            const user = await this.userModel.findById(userId).exec();
        
            if (!user) {
                throw new NotFoundException(`User with id ${userId} not found`);
            }
        
            // Create a new book object with the provided bookId and leesstatus.
            const newBook = { boekId: bookId, leesstatus: leesstatus };
        
            // Add the new book to the user's booklist.
            user.boekenlijst.push(newBook);
        
            // Save the updated user to the database.
            const updatedUser = await user.save();
        
            // Add the updated booklist to Neo4j.
            await this.neo4jService.addBookList(userId, bookId, leesstatus);
        
            return updatedUser;
        }
        

        async updateLeesstatus(userId: string, bookId: IBook, leesstatus: Leesstatus): Promise<IUser> {
            const user = await this.userModel.findById(userId).exec();

            if (!user) {
                throw new NotFoundException(`User with id ${userId} not found`);
            }
            // Find the book entry in boekenlijst with the given bookId
            const bookIndex = user.boekenlijst.findIndex(book => String(book.boekId) === bookId.toString());

            if (bookIndex === -1) {
                console.log(`Book with id ${bookId} not found in user's boekenlijst`);
                throw new NotFoundException(`Book with id ${bookId} not found in user's boekenlijst`);
            }

            // Update de leesstatus van het boek
            user.boekenlijst[bookIndex].leesstatus = leesstatus;

            const updatedUser = await user.save();

            this.neo4jService.updateBookList(userId, bookId, leesstatus);

            return updatedUser;
        }


        async removeBookBookList(userId: string, bookId: IBook): Promise<IUser> {
            const user = await this.userModel.findById(userId).exec();
        
            if (!user) {
                throw new NotFoundException(`User with id ${userId} not found`);
            }
            const bookIndex = user.boekenlijst.findIndex(book => String(book.boekId) === bookId.toString());
            if (bookIndex === -1) {
                throw new NotFoundException(`Book with id ${bookId} not found in user's boekenlijst`);
            }
    
            // Verwijder het boek van de boekenlijst
            user.boekenlijst.splice(bookIndex, 1);
        
            const updatedUser = await user.save();

            this.neo4jService.removeBookBookList(userId, bookId);

            return updatedUser;
        }


}