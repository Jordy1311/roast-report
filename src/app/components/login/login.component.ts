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
    <div>
      <h1 class="title">Sign in</h1>
      <form [formGroup]="credentials">
        <div class="field">
          <label class="label" for="email">Email</label>
          <div class="control">
            <input
              id="email"
              type="email"
              formControlName="email"
              class="input"
              [class.is-success]="invalidEmail === false && !invalidCredentialsSubmitted"
              [class.is-danger]="invalidEmail || invalidCredentialsSubmitted"
              [attr.aria-invalid]="invalidEmail || invalidCredentialsSubmitted"
              autocomplete="email"
              />
          </div>
        </div>

        <div class="field">
          <label class="label" for="password">Password</label>
          <div class="control">
            <input
              id="password"
              type="password"
              formControlName="password"
              class="input"
              [class.is-success]="invalidPassword === false && !invalidCredentialsSubmitted"
              [class.is-danger]="invalidPassword || invalidCredentialsSubmitted"
              [attr.aria-invalid]="invalidPassword || invalidCredentialsSubmitted"
              [attr.aria-describedby]="invalidCredentialsSubmitted ? 'password-helper' : null"
              autocomplete="current-password"
              />
          </div>
          @if (invalidCredentialsSubmitted) {
            <p class="help is-danger">Please check your email & password.</p>
          }
        </div>

        <div class="field">
          <div class="control">
            <button class="button is-primary" (click)="login()">Log in</button>
          </div>
        </div>
      </form>
    </div>
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
