import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private accessTokenAddress = 'access_token';

  constructor(private http: HttpClient) { }

  login(email: string, password: string): void {
    this.http.post<{ accessToken: string }>('/api/login', { email, password })
      .subscribe((loginResult) => {
        this.storeToken(loginResult.accessToken);
      });
  }

  private storeToken(accessToken: string) {
    localStorage.setItem(this.accessTokenAddress, accessToken);
  }

  logout(): void {
    localStorage.removeItem(this.accessTokenAddress);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem(this.accessTokenAddress);
  }

  isLoggedOut(): boolean {
    return !this.isLoggedIn();
  }
}
