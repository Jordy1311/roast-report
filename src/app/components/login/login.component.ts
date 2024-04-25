import { Component, OnInit, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from '../../services/auth.service';
import { debounceTime } from 'rxjs';

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
            [attr.aria-invalid]="invalidCredentialsSubmitted || invalidEmail"
            autocomplete="email"
            />
        </label>

        <label>
          Password
          <input
            type="password"
            formControlName="password"
            aria-label="Password"
            [attr.aria-invalid]="invalidCredentialsSubmitted || invalidPassword"
            [attr.aria-describedby]="invalidCredentialsSubmitted ? 'password-helper' : null"
            autocomplete="current-password"
            />
          @if (invalidCredentialsSubmitted) {
            <small id="password-helper">Please check your email & password.</small>
          }
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
  private authService = inject(AuthService);
  private router = inject(Router);

  invalidCredentialsSubmitted?: boolean;
  invalidEmail?: boolean;
  invalidPassword?: boolean;

  credentials = new FormGroup({
    email: new FormControl<string>('',
      { validators: [ Validators.required, Validators.email ], nonNullable: true }
    ),
    password: new FormControl<string>('',
      { validators: [ Validators.required ], nonNullable: true }
    ),
  });

  ngOnInit(): void {
    if (this.authService.isLoggedIn) {
      this.router.navigate(['/']);
    }

    // toggle error state dependant on input validity
    this.email?.valueChanges
      .pipe(debounceTime(500))
      .subscribe(() => {
        if (this.email!.errors) {
          this.invalidEmail = true;
        } else {
          this.invalidEmail = false;
        }
      });
    this.password?.valueChanges
      .pipe(debounceTime(250))
      .subscribe(() => {
        if (this.password!.errors) {
          this.invalidPassword = true;
        } else {
          this.invalidPassword = false;
        }
      });

    // remove error state on value change
    this.credentials.valueChanges.subscribe(() => {
      this.invalidCredentialsSubmitted = undefined;
    });
    this.email?.valueChanges.subscribe(() => {
      this.invalidEmail = undefined;
    });
    this.password?.valueChanges.subscribe(() => {
      this.invalidPassword = undefined;
    });
  }

  private get email() {
    return this.credentials.get('email');
  }

  private get password() {
    return this.credentials.get('password');
  }

  login() {
    if (this.credentials.valid && this.email?.value && this.password?.value) {
      this.authService.login(this.email!.value, this.password!.value)
        .subscribe(
          (response) => {
            this.authService.storeToken(response.accessToken);
            this.router.navigate(['/']);
          },
          () => {
            this.invalidCredentialsSubmitted = true;
          }
        );
    }
  }
}
