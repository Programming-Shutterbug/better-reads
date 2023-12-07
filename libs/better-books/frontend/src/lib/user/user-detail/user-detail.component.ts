import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { IUser } from '@nx-emma-indiv/shared/api';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'nx-emma-indiv-user-detail',
  templateUrl: 'user-detail.component.html',
  styleUrls: ['./user-detail.component.css'],
})

export class UserDetailComponent implements OnInit {
  showDeleteConfirmation = false;
    user = {} as IUser;
    users: IUser[] | null = null;
    userId: string | null = null;
    showButton: boolean | undefined;

    constructor( 
      private route: ActivatedRoute, 
      private userService: UserService,
      private router: Router, 
      private authService: AuthService,
      ) {}

    ngOnInit(): void {

      this.route.paramMap.subscribe((params) => {
        this.userId = params.get('_id');

          // Retrieve user ID from AuthService
          this.authService.currentUser$.subscribe({
              next: (user: IUser | null) => {
                 if (user) {
                  this.userId = user._id;      

                
                    // Fetch book details using this.bookId
                    this.userService.read(this.userId).subscribe((observable) => {
                    this.user = observable;
          
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
      return this.userId === this.user?._id;
    }
  

    deleteUser(): void {
      if (this.userId !== this.user?._id) {
        console.error('Current user is not the creator of the user. Deletion is not allowed.');
        return;
      }

      if (this.userId) {
        this.userService.delete(this.user).subscribe({
          next: () => {
            console.log('Book deleted successfully');

            // Close the confirmation dialog
            this.showDeleteConfirmation = false;
            
            this.authService.logout();
            // Navigate back to the dashboard
            this.router.navigate(['/'])
            
          },
          error: (error) => {
            console.error('Error deleting user:', error);
          }
        });
      } else {
        console.error('User _id is missing for deletion.');
      }
    }

    goBack(): void {
      window.history.back();
    }
}
