import { Component, OnInit } from '@angular/core';
import { BookService } from '../book.service';
import { IBook, IUser, Leesstatus } from '@nx-emma-indiv/shared/api';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';
import { UserService } from '../../user/user.service';

@Component({
  selector: 'nx-emma-indiv-book-status',
  templateUrl: 'book-status.component.html',
  styleUrls: ['./book-status.component.css'],
})

export class BookStatusComponent implements OnInit {

      bookId: string | null = null;
      userId: string | null = null;
      user: IUser | null = null;
      book: IBook[] | null = null;

    constructor( 
      private route: ActivatedRoute, 
      private router: Router,
      private userService: UserService,
      private bookService: BookService,
      private authService: AuthService,
      ) {}

      ngOnInit(): void {
        // Haal bookId op van route parameter
        this.route.paramMap.subscribe((params) => {
          const bookIdParam = params.get('_id');
          if (bookIdParam) {
            this.bookId = bookIdParam;
          }
        });
    
        // Retrieve user ID from AuthService
        this.authService.currentUser$.subscribe({
          next: (user: IUser | null) => {
            if (user) {
              this.userId = user._id;
              this.user = user;
            }
          },
          error: (error) => {
            console.error('Error getting user information:', error);
          },
        });
      }
      

      handleStatusChange(leesstatus: string): void {
        // Check of het boek bestaat in het boekenlijst
        this.userService.findOneWithBooklist(this.userId!).subscribe({
          next: (userWithBooklist: IUser) => {
            this.user = userWithBooklist;
      
            const bookExists = this.user.boekenlijst.some(book => book.boekId._id === this.bookId);
      
            console.log('userId:', this.userId);
            console.log('bookId:', this.bookId);
            console.log('bookExists:', bookExists);
      
            if (!bookExists) {
              // Boek bestaat niet, voeg het toe aan de boekenlijst
              this.bookService.addBookBooklist(this.userId!, this.bookId!, leesstatus as Leesstatus).subscribe(
                (result) => {
                  console.log(`Book added to boekenlijst with status: ${leesstatus}`);
                  this.router.navigate([`${this.userId}/dashboard`]);
                },
                (error) => {
                  console.error('Error adding book to boekenlijst', error);
                }
              );
            } else {
              // Boek bestaat, update de leesstatus
              this.bookService.updateLeesstatus(this.userId!, this.bookId!, leesstatus as Leesstatus).subscribe(
                (result) => {
                  console.log(`Book status updated: ${leesstatus}`);
                  this.router.navigate([`${this.userId}/dashboard`]);
                },
                (error) => {
                  console.error('Error updating book status', error);
                },
              );
            }
          },
          error: (error) => {
            console.error('Error getting user information with booklist:', error);
          },
        });
      }

      removeBookFromList(): void {
        this.bookService.removeBookFromBoekenlijst(this.userId!, this.bookId!).subscribe({
          next: (result) => {
            console.log('Book removed from the list');
            this.router.navigate([`${this.userId}/dashboard`]);
          },
          error: (error) => {
            console.error('Error removing book from the list', error);
          },
        });
      }
    
}
