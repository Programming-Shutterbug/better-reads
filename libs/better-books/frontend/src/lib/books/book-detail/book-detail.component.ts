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
        // Krijg bookId van route parameter
        this.route.paramMap.subscribe((params) => {
          this.bookId = params.get('_id');
      
          // Krijg userID van AuthService
          this.authService.currentUser$.subscribe({
            next: (user: IUser | null) => {
              if (user) {
                this.userId = user._id;            
                // Boek details ophalen gebaseerd op bookId
                this.bookService.read(this.bookId).subscribe((observable) => {
                  this.book = observable;

                    // Check of de userId en creator hetzelfde zijn, als het niet zo is, is de knop niet zichtbaar
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
      
              // sluit de uitklap dialoog
              this.showDeleteConfirmation = false;
              // Ga terug naar boekenlijst
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
