import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { LoginService } from '../services/login.service';

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
          <input type="email" name="email" autocomplete="email" [(ngModel)]="email" required />
        </label>
        <label>
          Password
          <input type="password" name="password" autocomplete="current-password" [(ngModel)]="password" required />
        </label>
      </fieldset>

      <input type="submit" value="Log in" (click)="login()" />
    </form>
  `,
})
export class LoginComponent {
  email: string = '';
  password: string = '';

  constructor(private loginService: LoginService) {}

  login(): void {
    if (!this.email || !this.password) {
      return;
    }

    this.loginService.login(this.email!, this.password!)
      .subscribe((response) => console.log(response));
  }
}
