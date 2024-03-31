import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';

export const accessTokenAddress = 'access_token';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  storeToken(accessToken: string): void {
    localStorage.setItem(accessTokenAddress, accessToken);
  }

  login(email: string, password: string): Observable<{ accessToken: string; }> {
    return this.http.post<{ accessToken: string; }>('/api/login', { email, password })
      .pipe(catchError(this.handleError));
  }

  logout(): void {
    localStorage.removeItem(accessTokenAddress);
  }

  get isLoggedIn(): boolean {
    return !!localStorage.getItem(accessTokenAddress);
  }

  get isLoggedOut(): boolean {
    return !this.isLoggedIn;
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // Client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      console.error(`Backend returned code ${error.status}, body was: ${error.error}`);
    }
    return throwError(
      () => new Error('Login failed. Please check your credentials or try again later.')
    );
  }
}
