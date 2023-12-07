import { Component, OnInit } from '@angular/core';
import { BookService } from '../book.service';
import { IBook, IWriter, IUser } from '@nx-emma-indiv/shared/api';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'nx-emma-indiv-book-detail',
  templateUrl: 'book-detail.component.html',
  styleUrls: ['./book-detail.component.css'],
})

export class BookDetailComponent implements OnInit {
    showDeleteConfirmation = false;
    showBookStatus = false;

      book = {} as IBook; 
      books: IBook[] | null = null;
      bookId: string | null = null;
      writers: IWriter[] = [];
      userId: string | null = null;
      user: IUser | null = null;
      showButton: boolean | undefined;

    constructor( 
      private route: ActivatedRoute, 
      private bookService: BookService,
      private authService: |AuthService,
      private router: Router) {}

      ngOnInit(): void {
        // Retrieve bookId from route parameter
        this.route.paramMap.subscribe((params) => {
          this.bookId = params.get('_id');
      
          // Retrieve user ID from AuthService
          this.authService.currentUser$.subscribe({
            next: (user: IUser | null) => {
              if (user) {
                this.userId = user._id;      
                // Now you have both bookId and userId, you can use them as needed.
      
                // Fetch book details using this.bookId
                this.bookService.read(this.bookId).subscribe((observable) => {
                  this.book = observable;

                    // Set a flag to determine whether the button should be visible
                    this.showButton = this.isCurrentUserCreator();
                });
              }
            },
            error: (error) => {
              console.error('Error getting user information:', error);
            },
          });
        });
      }

      isCurrentUserCreator(): boolean {
        // Check if userId is the same as the creatorID
        return this.userId === this.book?.creatorID;
      }

      deleteBook(): void {
        if (this.userId !== this.book?.creatorID) {
          console.error('Current user is not the creator of the book. Deletion is not allowed.');
          return;
        }
      
        if (this.bookId) {
          this.bookService.delete(this.book).subscribe({
            next: () => {
              console.log('Book deleted successfully');
      
              // Close the confirmation dialog
              this.showDeleteConfirmation = false;
              // Navigate back to the book list
              this.router.navigate(['../../books'], { relativeTo: this.route });
            },
            error: (error) => {
              console.error('Error deleting book:', error);
            }
          });
        } else {
          console.error('Book _id is missing for deletion.');
        }
      }
      

}
