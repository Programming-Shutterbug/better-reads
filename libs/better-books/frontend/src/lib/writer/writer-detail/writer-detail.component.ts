import { Component, OnInit } from '@angular/core';
import { WriterService } from '../writer.service';
import { IUser, IWriter } from '@nx-emma-indiv/shared/api';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'nx-emma-indiv-writer-detail',
  templateUrl: 'writer-detail.component.html',
  styleUrls: ['./writer-detail.component.css'],
})

export class WriterDetailComponent implements OnInit {
  showDeleteConfirmation = false;
  writer = {} as IWriter;
  writers: IWriter[] | null = null;
  writerId: string | null = null;
  userId: string | null = null;
  showButton: boolean | undefined;

    constructor( 
      private route: ActivatedRoute, 
      private writerService: WriterService,
      private authService: AuthService,
      private router: Router,
      ) {}

    ngOnInit(): void {
      // Retrieve bookId from route parameter
      this.route.paramMap.subscribe((params) => {
        this.writerId = params.get('_id');

          // Retrieve user ID from AuthService
          this.authService.currentUser$.subscribe({
            next: (user: IUser | null) => {
              if (user) {
                this.userId = user._id;      

      
                // Fetch writer details using this.writerId
                this.writerService.read(this.writerId).subscribe((observable) => {
                  this.writer = observable;

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
        return this.userId === this.writer?.creatorID;
      }

    deleteWriter(): void {
      if (this.userId !== this.writer?.creatorID) {
        console.error('Current user is not the creator of the writer. Deletion is not allowed.');
        return;
      }

      if (this.writerId) {
        this.writerService.delete(this.writer).subscribe({
          next: () => {
            console.log('Writer deleted successfully');

            // Close the confirmation dialog
            this.showDeleteConfirmation = false;
            // Navigate back to the writer list
            this.router.navigate(['../../writers'], { relativeTo: this.route });
          },
          error: (error) => {
            console.error('Error deleting writer:', error);
          }
        });
      } else {
        console.error('Writer _id is missing for deletion.');
      }
    }

    goBack() {
      // Navigate back to the previous route
      window.history.back();
    }
}
