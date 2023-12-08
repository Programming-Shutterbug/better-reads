import { Component, OnInit } from '@angular/core';
import { WriterService } from '../writer.service';
import { IUser, IWriter } from '@nx-emma-indiv/shared/api';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'nx-emma-indiv-writer-edit',
  templateUrl: 'writer-new.component.html',
  styleUrls: ['./writer-new.component.css'],
})

export class WriterNewComponent implements OnInit {
  writer = {} as IWriter;
  userId: string | null = null;

    constructor(
      private writerService: WriterService,
      private authService: AuthService,
      private router: Router, 
      ) {}

    ngOnInit(): void {
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

    createWriter(): void {
      // Assuming this.userId contains the current user's ID
      if (!this.userId) {
        console.error('User ID is missing. Cannot create writer without a user.');
        return;
      }
    
      // Zet de creatorID (userID) in het schrijver object
      this.writer.creatorID = this.userId;
    
      this.writerService.create(this.writer).subscribe({
        next: (createdWriter) => {
          console.log('Writer created successfully:', createdWriter);
          this.router.navigate(['../../writers']);
        },
        error: (error) => {
          console.error('Error creating writer:', error);
        }
      });      
    }
    
    goBack(): void {
      this.router.navigate(['../../writers']);
    }

    checkFutureWriterDate(): boolean {
      const currentDate = new Date();
      const inputDate = new Date(this.writer.geboortedatum);
    
      return inputDate > currentDate;
    }
}
