import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
  ],
  styleUrl: './register.component.scss',
  template: `
    <div>
      <h1>Register</h1>

      <form [formGroup]="user">
        <mat-form-field appearance="outline">
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

        <mat-form-field appearance="outline">
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

        <button (click)="register()" mat-flat-button color="primary">
          Log in
        </button>
      </form>
    </div>
  `,
})
export class RegisterComponent {
  private authService = inject(AuthService);
  private router = inject(Router);

  invalidCredentialsSubmitted = false;

  user = new FormGroup({
    email: new FormControl<string>('', {
      validators: [Validators.required, Validators.email],
      nonNullable: true,
    }),
    password: new FormControl<string>('', {
      validators: [Validators.required],
      nonNullable: true,
    }),
  });

  ngOnInit(): void {
    if (this.authService.isLoggedIn) {
      this.router.navigate(['/']);
    }
  }

  register(): void {
    console.log('register method in RegisterComponent fired');
  }
}
