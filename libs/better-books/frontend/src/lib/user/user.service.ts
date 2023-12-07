import { Observable, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { map, catchError, tap } from 'rxjs/operators';
import { ApiResponse, IUser } from '@nx-emma-indiv/shared/api';
import { Injectable } from '@angular/core';
import { environment } from '@nx-emma-indiv/shared/util-env';
import { BookService } from '../books/book.service';

/**
 * See https://angular.io/guide/http#requesting-data-from-a-server
 */
export const httpOptions = {
    observe: 'body',
    responseType: 'json',
};

/**
 */
@Injectable()
export class UserService {

    //endpoint = 'http://localhost:3000/api/user';
    //endpoint = environment.dataApiUrl + '/user';
    endpoint = `${environment.dataApiUrl}/api/user`;


    constructor(private readonly http: HttpClient,
      private bookService: BookService) {}

    /**
     * Get all items.
     *
     * @options options - optional URL queryparam options
     */
    public list(options?: any): Observable<IUser[] | null> {
        console.log(`list ${this.endpoint}`);

        return this.http
            .get<ApiResponse<IUser[]>>(this.endpoint, {
                ...options,
                ...httpOptions,
            })
            .pipe(
                map((response: any) => response.results as IUser[]),
                tap(console.log),
                catchError(this.handleError)
            );
    }

    /**
     * Get a single item from the service.
     *
     */
    public read(_id: string | null, options?: any): Observable<IUser> {
        console.log(`read ${this.endpoint}/${_id}`);
        return this.http
            .get<ApiResponse<IUser>>(`${this.endpoint}/${_id}`, {
                ...options,
                ...httpOptions,
            })
            .pipe(
                tap(console.log),
                map((response: any) => response.results as IUser),
                catchError(this.handleError)
            );
    }

    public create(user: IUser): Observable<IUser> {
        console.log(`create ${this.endpoint}`);
    
        const httpOptions = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
          }),
        };
    
        return this.http
          .post<ApiResponse<IUser>>(this.endpoint, user, httpOptions)
          .pipe(
            tap(console.log),
            map((response: any) => response.results as IUser),
            catchError(this.handleError)
          );
    }

    public update(user: IUser): Observable<IUser> {
        console.log(`update ${this.endpoint}/${user._id}`);
        return this.http
          .put<ApiResponse<IUser>>(`${this.endpoint}/${user._id}`, user)
          .pipe(
            tap(console.log),
            catchError((error) => {
              console.error('Update error:', error);
              throw error;
            })
          );
    }

    public delete(user: IUser): Observable<IUser> {
      console.log(`delete ${this.endpoint}/${user._id}`);
      return this.http
        .delete<ApiResponse<IUser>>(`${this.endpoint}/${user._id}`)
        .pipe(tap(console.log), catchError(this.handleError));
    }

    public findOneWithBooklist(_id: string | null): Observable<IUser> {
      console.log(`getUserWithBooklist ${this.endpoint}/${_id}/dashboard`);
      return this.http
          .get<ApiResponse<IUser>>(`${this.endpoint}/${_id}/dashboard`)
          .pipe(
              tap(console.log),
              map((response: any) => {
                  const userWithBooklist: IUser = response.results as IUser;

                  // Map each item in the boekenlijst to fetch the corresponding book details
                  userWithBooklist.boekenlijst = userWithBooklist.boekenlijst.map(
                      (bookListItem: any) => {
                          return {
                              ...bookListItem,
                              bookDetails: this.bookService.getBookDetails(bookListItem.boekId),
                          };
                      }
                  );

                  return userWithBooklist;
              }),
              catchError(this.handleError)
          );
  }

    /**
     * Handle errors.
     */
    public handleError(error: HttpErrorResponse): Observable<any> {
        console.log('handleError in UserService', error);

        return throwError(() => new Error(error.message));
    }
}
