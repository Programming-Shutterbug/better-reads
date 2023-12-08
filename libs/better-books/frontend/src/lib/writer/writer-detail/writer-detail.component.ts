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
      // Haal boekId van route parameter
      this.route.paramMap.subscribe((params) => {
        this.writerId = params.get('_id');

          // Retrieve user ID from AuthService
          this.authService.currentUser$.subscribe({
            next: (user: IUser | null) => {
              if (user) {
                this.userId = user._id;      

                // Haal schrijverdetails op met gebruik van writerId
                this.writerService.read(this.writerId).subscribe((observable) => {
                  this.writer = observable;

                // Als userId van ingelogde account en creatorId niet overheen komen, knoppen niet zichtbaar
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

            // Sluit de dialog
            this.showDeleteConfirmation = false;

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
      window.history.back();
    }
}
