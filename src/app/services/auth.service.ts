import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export const accessTokenAddress = 'access_token';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  private storeToken(accessToken: string): void {
    localStorage.setItem(accessTokenAddress, accessToken);
  }

  login(email: string, password: string): void {
    this.http.post<{ accessToken: string }>('/api/login', { email, password })
      .subscribe((loginResult) => {
        this.storeToken(loginResult.accessToken);
      });
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
}
