import { Component, OnInit } from '@angular/core';
import { WriterService } from '../writer.service';
import { IUser, IWriter } from '@nx-emma-indiv/shared/api';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'nx-emma-indiv-writer-edit',
  templateUrl: 'writer-edit.component.html',
  styleUrls: ['./writer-edit.component.css'],
})

export class WriterEditComponent implements OnInit {
  writer = {} as IWriter;
  writers: IWriter[] | null = null;
  writerId: string | null = null;
  userId: string | null = null;

    constructor( 
      private route: ActivatedRoute, 
      private writerService: WriterService,
      private authService: AuthService,
      private router: Router,
      ) {}

    ngOnInit(): void {
  
      this.route.paramMap.subscribe((params) => {
        this.writerId = params.get('_id');
        
          // Bestaande writer
          this.writerService.read(this.writerId).subscribe((observable) => 
          this.writer = observable);
      });

        // Retrieve user ID from AuthService
        this.authService.currentUser$.subscribe({
          next: (user: IUser | null) => {
            if (user) {
              this.userId = user._id;
            }
          },
          error: (error) => {
            console.error('Error getting user information:', error);
          },
        });
    }

    updateWriter() {
      if (this.userId !== this.writer?.creatorID) {
        console.error('Current user is not the creator of the writer. Updating is not allowed.');
        return;
      }
      
      console.log('Updating writer:', this.writer);
      
      this.writerService.update(this.writer).subscribe({
        next: (updatedWriter) => {
          console.log('Writer updated successfully:', updatedWriter);
          this.router.navigate(['../../writers', this.writer._id]);
        },
        error: (error) => {
          console.error('Error updating writer:', error);
        }
      });
      
    }

    goBack(): void {
      this.router.navigate(['../../writers', this.writer._id]);
    }

    checkFutureWriterDate(): boolean {
      const currentDate = new Date();
      const inputDate = new Date(this.writer.geboortedatum);
    
      return inputDate > currentDate;
    }
}
