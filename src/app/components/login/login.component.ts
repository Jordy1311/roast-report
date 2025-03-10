import { Component, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import {
  FormControl,
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
  imports: [
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
  ],
  styleUrl: './login.component.scss',
  template: `
    <main>
      <h1>Roast Report</h1>

      <form>
        <mat-form-field appearance="outline">
          <mat-label>Email</mat-label>
          <input
            matInput
            id="email"
            type="email"
            [formControl]="emailControl"
            autocomplete="email"
            placeholder="you@example.com"
          />
          @if (!invalidEmailSubmitted) {
            <mat-error>Please check your email.</mat-error>
          }
          @if (validEmailSubmitted) {
            <mat-hint>Please check your email and follow the log in link 😊</mat-hint>
          }
        </mat-form-field>

        <button
          mat-flat-button
          type="button"
          color="primary"
          [disabled]="validEmailSubmitted"
          (click)="requestLogin()"
        >
          Register / Log in
        </button>
      </form>
    </main>
  `,
})
export class LoginComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);

  invalidEmailSubmitted = false;
  validEmailSubmitted = false;

  emailControl = new FormControl<string>('', {
    validators: [Validators.required, Validators.email],
    nonNullable: true,
  });

  ngOnInit(): void {
    if (this.authService.isLoggedIn) {
      this.router.navigate(['/']);
    }

    // removes error states on any input update
    this.emailControl.valueChanges.subscribe(() => {
      if (this.invalidEmailSubmitted) {
        this.invalidEmailSubmitted = false;
        this.emailControl.setErrors(null);
      }
    });
  }

  requestLogin(): void {
    if (this.emailControl.valid && this.emailControl.value) {
      this.authService
        .requestLogin(this.emailControl.value)
        .subscribe({
          next: () => {
            this.validEmailSubmitted = true;
            this.emailControl.disable()
            return;
          },
          error: () => {
            this.invalidEmailSubmitted = true;
            this.emailControl.setErrors({ invalid: 'Invalid credentials provided' });
            return;
          },
        });
    } else {
      this.invalidEmailSubmitted = true;
    }
  }
}
