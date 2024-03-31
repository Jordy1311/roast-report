import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ ReactiveFormsModule ],
  styleUrl: './login.component.css',
  template: `
    <form [formGroup]="credentials" (ngSubmit)="login()">
      <fieldset>
        <label>
          Email
          <input
            type="email"
            formControlName="email"
            aria-label="Email"
            [attr.aria-invalid]="isInvalidEmail"
            aria-describedby="email-helper"
            autocomplete="email"
            />
          <small id="email-helper">
            {{ isInvalidEmail ? "That doesn't look right." : "We'll never share your email with anyone else." }}
          </small>
        </label>

        <label>
          Password
          <input
            type="password"
            formControlName="password"
            aria-label="Password"
            [attr.aria-invalid]="isInvalidPassword"
            autocomplete="current-password"
            />
        </label>
      </fieldset>

      <input
        type="submit"
        value="Log in"
        />
    </form>
  `,
})
export class LoginComponent {
  credentials = new FormGroup({
    email: new FormControl<string>(
      '', { validators: [ Validators.required, Validators.email ] }
    ),
    password: new FormControl<string>(
      '', { validators: [ Validators.required ] }
    ),
  });

  constructor(private authService: AuthService) {}

  get email() {
    return this.credentials.get('email');
  }

  get password() {
    return this.credentials.get('password');
  }

  get isInvalidEmail(): boolean | undefined {
    if (!this.email?.value) {
      return undefined;
    } else if (!this.email?.valid) {
      return true;
    }
    return false;
  }

  get isInvalidPassword(): boolean | undefined {
    if (!this.password?.touched) {
      return undefined;
    } else if (!this.password?.valid) {
      return true;
    }
    return false;
  }

  login(): void {
    if (this.credentials.valid && this.email?.value && this.password?.value) {
      this.authService.login(this.email?.value, this.password?.value);
    }
  }
}
