import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AuthService } from '../services/auth.service';

@Component({
  selector: 'login',
  standalone: true,
  imports: [ FormsModule ],
  styleUrl: './login.component.css',
  template: `
    <form>
      <fieldset>
        <label>
          Email
          <input
            type="email"
            name="email"
            [(ngModel)]="email"
            required
            aria-label="Email"
            aria-describedby="email-helper"
            autocomplete="email" />
          <small id="email-helper">
            We'll never share your email with anyone else.
          </small>
        </label>

        <label>
          Password
          <input
            type="password"
            name="password"
            [(ngModel)]="password"
            required
            aria-label="Password"
            autocomplete="current-password" />
        </label>
      </fieldset>

      <input type="submit" value="Log in" (click)="login()" />
    </form>
  `,
})
export class LoginComponent {
  email: string = '';
  password: string = '';

  constructor(private authService: AuthService) {}

  login(): void {
    if (!this.email || !this.password) {
      return;
    }

    this.authService.login(this.email!, this.password!)
      .subscribe((response) => console.log(response));
  }
}
