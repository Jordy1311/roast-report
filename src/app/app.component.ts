import { Component } from '@angular/core';

import { AuthService } from './services/auth.service';
import { LoginComponent } from './login/login.component';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ NgIf, LoginComponent ],
  styleUrl: './app.component.css',
  template: `
    <login *ngIf="isLoggedOut" />
    <h1 *ngIf="isLoggedIn">You're logged in!!</h1>
  `,
})
export class AppComponent {
  constructor(private authService: AuthService) { }

  public get isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  public get isLoggedOut(): boolean {
    return this.authService.isLoggedOut();
  }
}
