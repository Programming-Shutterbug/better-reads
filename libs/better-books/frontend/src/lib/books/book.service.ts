import { Observable, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { map, catchError, tap } from 'rxjs/operators';
import { ApiResponse, IBook, IWriter, IUser, IBookList, Leesstatus } from '@nx-emma-indiv/shared/api';
import { Injectable } from '@angular/core';
import { environment } from '@nx-emma-indiv/shared/util-env';

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
export class BookService {

    //endpoint = 'http://localhost:3000/api/book';
    //endpoint = environment.dataApiUrl + '/book';
    endpoint = `${environment.dataApiUrl}/api/book`;

    constructor(private readonly http: HttpClient) {}
    

    /**
     * Get all items.
     *
     * @options options - optional URL queryparam options
     */
    public list(options?: any): Observable<IBook[] | null> {
        console.log(`list ${this.endpoint}`);

        return this.http
            .get<ApiResponse<IBook[]>>(this.endpoint, {
                ...options,
                ...httpOptions,
            })
            .pipe(
                map((response: any) => response.results as IBook[]),
                tap(console.log),
                catchError(this.handleError)
            );
    }

    /**
     * Get a single item from the service.
     *
     */
    public read(_id: string | null, options?: any): Observable<IBook> {
        console.log(`read ${this.endpoint}/${_id}`);
        return this.http
            .get<ApiResponse<IBook>>(`${this.endpoint}/${_id}`, {
                ...options,
                ...httpOptions,
            })
            .pipe(
                tap(console.log),
                map((response: any) => response.results as IBook),
                catchError(this.handleError)
            );
    }

    public create(book: IBook): Observable<IBook> {
        console.log(`create ${this.endpoint}`);
    
        const httpOptions = {
          headers: new HttpHeaders({
            'Content-Type': 'application/json',
          }),
        };
    
        return this.http
          .post<ApiResponse<IBook>>(this.endpoint, book, httpOptions)
          .pipe(
            tap(console.log),
            map((response: any) => response.results as IBook),
            catchError(this.handleError)
          );
    }

    public update(book: IBook): Observable<IBook> {
        console.log(`update ${this.endpoint}/${book._id}`);
        return this.http
          .put<ApiResponse<IBook>>(`${this.endpoint}/${book._id}`, book)
          .pipe(tap(console.log), catchError(this.handleError)
          );
    }

    public delete(book: IBook): Observable<IBook> {
      console.log(`delete ${this.endpoint}/${book._id}`);
      return this.http
        .delete<ApiResponse<IBook>>(`${this.endpoint}/${book._id}`)
        .pipe(tap(console.log), catchError(this.handleError));
    }

    public getWriter(writerId: string | null): Observable<IWriter> {
        const writerEndpoint = `${environment.dataApiUrl}/api/writer/${writerId}`;

        return this.http
            .get<ApiResponse<IWriter>>(writerEndpoint)
            .pipe(
                tap(console.log),
                map((response: any) => response.results as IWriter),
                catchError(this.handleError)
            );
    }

    public getBookDetails(bookId: string): Observable<IBook> {
      return this.http.get<ApiResponse<IBook>>(`${this.endpoint}/books/${bookId}`).pipe(
          map((response: any) => response.results as IBook),
          catchError(this.handleError)
      );
    }


    public addBookBooklist(userId: string, boekId: string, leesstatus: Leesstatus): Observable<IUser> {
      const endpoint = `${environment.dataApiUrl}/api/book/${boekId}/${userId}/booklist`;
      const requestBody = { boekId: boekId, leesstatus: leesstatus };

      return this.http
          .post<ApiResponse<IUser>>(endpoint, requestBody)
          .pipe(
              tap(console.log),
              map((response: any) => response.results as IUser),
              catchError(this.handleError)
          );
    }

    public updateLeesstatus(userId: string, boekId: string, leesstatus: Leesstatus): Observable<IUser> {
        const endpoint = `${environment.dataApiUrl}/api/book/${boekId}/${userId}/booklist`;
        const requestBody = { boekId: boekId, leesstatus: leesstatus };
    
        return this.http
            .put<ApiResponse<IUser>>(endpoint, requestBody)
            .pipe(
                tap(console.log),
                map((response: any) => response.results as IUser),
                catchError(this.handleError)
            );
    }
      
    public removeBookFromBoekenlijst(userId: string, boekId: string): Observable<IUser> {
        const endpoint = `${environment.dataApiUrl}/api/book/${boekId}/${userId}/booklist`;
    
        return this.http
            .delete<ApiResponse<IUser>>(endpoint)
            .pipe(
                tap(console.log),
                map((response: any) => response.results as IUser),
                catchError(this.handleError)
            );
    }

    public getRecommendations(boekId: string | null, options?: any): Observable<IBook[]> {
        console.log(`Fetching recommendations for book ${boekId}`);

        return this.http
            .get<ApiResponse<IBook[]>>(`${environment.dataApiUrl}/api/book/${boekId}/recommendations`, {
                ...options,
                ...httpOptions,
            })
            .pipe(
                map((response: any) => response.results as IBook[]),
                tap(console.log),
                catchError(this.handleError)
            );
      }

  

    /**
    * Handle errors.
    */
    public handleError(error: HttpErrorResponse): Observable<any> {
        console.log('handleError in BookService', error);
    
        return throwError(() => new Error(error.message));
    }
}
