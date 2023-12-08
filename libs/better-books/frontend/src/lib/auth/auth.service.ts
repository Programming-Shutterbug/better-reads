import { Injectable, InjectionToken } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '@nx-emma-indiv/shared/util-env';
import { map, catchError, switchMap } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { IUser } from '@nx-emma-indiv/shared/api';

export const AUTH_SERVICE_TOKEN = new InjectionToken<AuthService>('AuthService');

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  public currentUser$ = new BehaviorSubject<IUser | null>(null);
  private readonly CURRENT_USER = 'currentuser';
  private readonly headers = new HttpHeaders({
    'Content-Type': 'application/json',
  });

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    // Check of we al een ingelogde user hebben
    // Zo ja, check dan op de backend of het token nog valid is.
    // Het token kan namelijk verlopen zijn. Indien verlopen
    // retourneren we meteen een nieuw token.
    this.getUserFromLocalStorage()
      .pipe(
        switchMap((user: IUser | null) => {
          if (user) {
            console.log('User found in local storage');
            this.currentUser$.next(user);
            return of(user);
          } else {
            console.log(`No current user found`);
            return of(undefined);
          }
        })
      )
      .subscribe(() => console.log('Startup auth done'));
  }

  get currentUser(): Observable<IUser | null> {
    return this.currentUser$.asObservable();
  }

  login(email: string, password: string): Observable<IUser | null> {
    console.log(`login at ${environment.dataApiUrl}/api/user/login`);
  
    return this.http
      .post<{ results: IUser }>(`${environment.dataApiUrl}/api/user/login`, { email: email, password: password }, { headers: this.headers })
      .pipe(
        map((response) => {
          // Extract the user information from the API response
          const user = response.results;

          // Update the user ID before updating the BehaviorSubject
          user && user._id && this.updateUser({ ...user, _id: user._id });
  
          this.saveUserToLocalStorage(user);
          this.currentUser$.next(user);
          return user;
        }),
        catchError((error: any) => {
          console.log('error:', error);
          console.log('error.message:', error.message);
          console.log('error.error.message:', error.error.message);
          return of(null);
        })
      );
  }

  validateToken(userData: IUser): Observable<IUser | null> {
    const url = `${environment.dataApiUrl}/api/auth/profile`;
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + userData.token,
      }),
    };

    console.log(`validateToken at ${url}`);
    return this.http.get<any>(url, httpOptions).pipe(
      map((response) => {
        console.log('token is valid');
        return response as IUser;
      }),
      catchError(() => {
        console.log('Validate token Failed');
        //this.logout();
        this.currentUser$.next(null);
        return of(null);
      })
    );
  }

  logout(): void {
      this.router
        .navigate(['/'])
        .then((success) => {
          // true when canDeactivate allows us to leave the page.
          if (success) {
            console.log('logout - removing local user info');
            localStorage.removeItem(this.CURRENT_USER);
            this.currentUser$.next(null);
          } else {
            console.log('navigate result:', success);
          }
        })
        .catch((error) => console.log('not logged out!'));
  }

  getUserFromLocalStorage(): Observable<IUser | null> {
    const itemFromStorage = localStorage.getItem(this.CURRENT_USER);
      if (itemFromStorage === null) {
        return of(null);
      } else {
        const localUser = JSON.parse(itemFromStorage);
        return of(localUser);
      }
  }

  private saveUserToLocalStorage(user: IUser): void {
    localStorage.setItem(this.CURRENT_USER, JSON.stringify(user));
  }

  userMayEdit(itemUserId: string): Observable<boolean> {
    return this.currentUser$.pipe(
      map((user: IUser | null) => (user ? user._id === itemUserId : false))
    );
  }

  updateUser(user: IUser | null): void {
    this.currentUser$.next(user);
  }
}
