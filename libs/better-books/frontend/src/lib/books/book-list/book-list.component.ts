import { Component, OnInit, OnDestroy } from '@angular/core';
import { BookService } from '../book.service';
import { IBook } from '@nx-emma-indiv/shared/api';
import { Subscription } from 'rxjs';

@Component({
    selector: 'nx-emma-indiv-book-list',
    templateUrl: './book-list.component.html',
    styleUrls: ['./book-list.component.css'],
})
export class BookListComponent implements OnInit, OnDestroy {
    books: IBook[] | null = null;
    subscription: Subscription | undefined = undefined;
    searchTerm = '';

    constructor(private bookService: BookService) {}

    ngOnInit(): void {
        this.subscription = this.bookService.list().subscribe((results) => {
            console.log(`results: ${results}`);
            this.books = results;
        });
    }

    ngOnDestroy(): void {
        if (this.subscription) this.subscription.unsubscribe();
    }


    searchBooks(): IBook[] {
        const term = this.searchTerm.toLowerCase().trim();

        // als de zoekterm leeg is of er geen boeken zijn, geef lege array terug
        if (!term || !this.books) {
          return [];
        }
      
        // Filter boeken gebaseerd op zoekterm
        return this.books.filter(book =>
          book.titel.toLowerCase().includes(term)
        );
    }

    matchesSearch(book: IBook): boolean {
        const term = this.searchTerm.toLowerCase().trim();
      
        // Check if book titel is inclusief zoekterm
        return book.titel.toLowerCase().includes(term);
      }

}
