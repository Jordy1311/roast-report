import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';

import { API_URL } from '../variables';

export const accessTokenAddress = 'access_token';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);

  requestLogin(email: string) {
    return this.http
      .post(`${API_URL}/v1/login`, { email })
      .pipe(catchError((error) => this.handleError(error)));
  }

  storeToken(accessToken: string): void {
    localStorage.setItem(accessTokenAddress, accessToken);
  }

  confirmLogin(confirmationCode: string): Observable<{ accessToken: string }> {
    return this.http
      .post<{ accessToken: string; }>(
        `${API_URL}/v1/login/confirm/${confirmationCode}`, {}
      )
      .pipe(catchError((error) => this.handleError(error)));
  }

  logout(): void {
    localStorage.removeItem(accessTokenAddress);
    location.reload();
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
      console.error(`Backend returned status code ${error.status}, body was: `, error.error);
    }
    return throwError(
      () => new Error('Login failed. Please check your credentials or try again later.')
    );
  }
}
