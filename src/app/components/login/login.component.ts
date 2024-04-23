import { Component, OnInit } from '@angular/core';
import { NgIf } from '@angular/common';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ NgIf, ReactiveFormsModule ],
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
            [attr.aria-invalid]="error || isInvalidEmail"
            autocomplete="email"
            />

        </label>

        <label>
          Password
          <input
            type="password"
            formControlName="password"
            aria-label="Password"
            [attr.aria-invalid]="error || isInvalidPassword"
            [attr.aria-describedby]="error ? 'password-helper' : null"
            autocomplete="current-password"
            />
          <small *ngIf="error" id="password-helper">
            Please check your email & password.
          </small>
        </label>
      </fieldset>

      <input
        type="submit"
        value="Log in"
        />
    </form>
  `,
})
export class LoginComponent implements OnInit {
  error?: boolean;
  credentials = new FormGroup({
    email: new FormControl<string>(
      '', { validators: [ Validators.required, Validators.email ] }
    ),
    password: new FormControl<string>(
      '', { validators: [ Validators.required ] }
    ),
  });

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    if (this.authService.isLoggedIn) {
      this.router.navigate(['/']);
    }

    this.credentials.valueChanges.subscribe(() => {
      if (this.error) {
        this.error = false;
      }
    });
  }

  private get email() {
    return this.credentials.get('email');
  }

  private get password() {
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

  login() {
    if (this.credentials.valid && this.email?.value && this.password?.value) {
      this.authService.login(this.email?.value, this.password?.value)
        .subscribe(
          (response) => {
            this.authService.storeToken(response.accessToken);
            this.router.navigate(['/']);
          },
          () => {
            this.error = true;
          }
        );
    }
  }
}
