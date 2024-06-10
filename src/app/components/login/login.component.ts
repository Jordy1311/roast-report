import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ ReactiveFormsModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatIconModule ],
  styleUrl: './login.component.scss',
  template: `
    <div>
      <h1>Log in</h1>

      <form [formGroup]="credentials">
        <mat-form-field>
          <mat-label>Email</mat-label>
          <input
            matInput
            id="email"
            type="email"
            formControlName="email"
            autocomplete="email"
            placeholder="you@example.com"
          />
          @if (!invalidCredentialsSubmitted) {
            <mat-error>Please check your email.</mat-error>
          }
        </mat-form-field>

        <mat-form-field>
          <mat-label>Password</mat-label>
          <input
            matInput
            id="password"
            type="password"
            formControlName="password"
            autocomplete="current-password"
          />

          @if (invalidCredentialsSubmitted) {
            <mat-error>Please check your email & password.</mat-error>
          } @else {
            <mat-error>Please check your password.</mat-error>
          }
        </mat-form-field>

        <button
          (click)="login()"
          mat-flat-button
          color="primary"
        >
          Log in
        </button>
      </form>
    </div>
  `,
})
export class LoginComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);

  invalidCredentialsSubmitted = false;

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
      this.router.navigate([ '/' ]);
    }

    // removes error states on any input update
    this.credentials.valueChanges.subscribe(() => {
      if (this.invalidCredentialsSubmitted) {
        this.invalidCredentialsSubmitted = false;
        this.email!.setErrors(null);
        this.password!.setErrors(null);
      }
    });
  }

  private get email() {
    return this.credentials.get('email');
  }

  private get password() {
    return this.credentials.get('password');
  }

  login(): void {
    if (this.credentials.valid && this.email?.value && this.password?.value) {
      this.authService.login(this.email!.value, this.password!.value)
        .subscribe({
          next: (response) => {
            this.authService.storeToken(response.accessToken);
            this.router.navigate([ '/' ]);
          },
          error: () => {
            this.invalidCredentialsSubmitted = true;
            this.email!.setErrors({ invalid: 'Invalid credentials provided' });
            this.password!.setErrors({ invalid: 'Invalid credentials provided' });
            return;
          }
        });
    } else {
      this.invalidCredentialsSubmitted = true;
    }
  }
}
