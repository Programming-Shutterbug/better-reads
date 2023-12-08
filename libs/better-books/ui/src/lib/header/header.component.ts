import { Component, OnInit } from '@angular/core';
import { AuthService } from '@nx-emma-indiv/better-books/frontend';
import { IUser } from '@nx-emma-indiv/shared/api';
import { Router } from '@angular/router';

@Component({
  selector: 'nx-emma-indiv-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
  isLoggedIn = false;
  userId: string | null = null;


  constructor(
    private authService: AuthService,
    private router: Router
    ) {}

    ngOnInit(): void {
      this.authService.currentUser$.subscribe({
        next: (user: IUser | null) => {
          if (user) {
            this.isLoggedIn = !!user;
            this.userId = user._id;
          }
        },
        error: (error) => {
          console.error('Error getting user information:', error);
        },
      });
  }

  logout(): void {
    this.authService.logout();
    this.isLoggedIn = false;
  }

  navigateToEditPage(): void {
    this.router.navigate([`/users/${this.userId}/edit`]);
  }
}
