import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { IUser } from '@nx-emma-indiv/shared/api';
import { Router } from '@angular/router';
import { AuthService } from '../../auth/auth.service';

@Component({
  selector: 'nx-emma-indiv-user-new',
  templateUrl: 'user-new.component.html',
  styleUrls: ['./user-new.component.css'],
})

export class UserNewComponent implements OnInit {
    user = {} as IUser;
    userId: string | null = null;

    constructor( 
      private userService: UserService,
      private router: Router, 
      private authService: AuthService
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

    createUser(): void {
      if (!this.userId) {
        console.error('User ID is missing. Cannot create writer without a user.');
        return;
      }

      this.userService.create(this.user).subscribe({
        next: (createdUser) => {
          console.log('User created successfully:', createdUser);
          this.router.navigate(['../../users']);
        },
        error: (error) => {
          console.error('Error creating user:', error);
        }
      });      
    }

    goBack(): void {
      this.router.navigate(['../../users']);
    }
}
