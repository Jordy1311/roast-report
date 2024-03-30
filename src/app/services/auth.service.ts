import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export const accessTokenAddress = 'access_token';
@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  login(email: string, password: string): void {
    this.http.post<{ accessToken: string }>('/api/login', { email, password })
      .subscribe((loginResult) => {
        this.storeToken(loginResult.accessToken);
      });
  }

  private storeToken(accessToken: string) {
    localStorage.setItem(accessTokenAddress, accessToken);
  }

  logout(): void {
    localStorage.removeItem(accessTokenAddress);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem(accessTokenAddress);
  }

  isLoggedOut(): boolean {
    return !this.isLoggedIn();
  }
}
