import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

import { AlertService } from './alert.service';
import { API_URL } from '../variables';

export const accessTokenAddress = 'access_token';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private alertService = inject(AlertService);

  public requestLogin(email: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.http
        .post(`${API_URL}/v1/login`, { email })
        .subscribe({
          next: () => resolve(),
          error: (err) => this.handleAndReject(err, reject)
        });
    });
  }

  public confirmLogin(confirmationCode: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.http
        .post<{ accessToken: string; }>(
          `${API_URL}/v1/login/confirm/${confirmationCode}`, {}
        ).subscribe({
          next: ({ accessToken }) => {
            localStorage.setItem(accessTokenAddress, accessToken);
            resolve();
          },
          error: (err) => this.handleAndReject(err, reject)
        });
    });
  }

  public logout(): void {
    localStorage.removeItem(accessTokenAddress);
    location.reload();
  }

  get isLoggedIn(): boolean {
    return !!localStorage.getItem(accessTokenAddress);
  }

  get isLoggedOut(): boolean {
    return !this.isLoggedIn;
  }

  private handleAndReject(err: HttpErrorResponse, reject: any) {
    console.error(err);

    this.alertService.showOnly(
      'Something went wrong, refresh and try again.'
    );

    reject();
  }
}
