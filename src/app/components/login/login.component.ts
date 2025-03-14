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
      <div class="header">
        <h1 class="header-title">Roast Report</h1>
        <h1 class="header-icon" aria-hidden="true">
          <mat-icon [inline]="true" class="material-symbols-rounded">
            coffee_maker
          </mat-icon>
        </h1>
      </div>

      <form (keydown.enter)="requestLogin()">
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
          <mat-icon class="material-symbols-rounded" matSuffix>
            alternate_email
          </mat-icon>

          @if (emailControl.hasError('email') && !emailControl.hasError('required')) {
            <mat-error>Please double check your email is correct.</mat-error>
          }
          @else if (emailControl.hasError('required')) {
            <mat-error>Please enter your email.</mat-error>
          }
          @else if (displayCheckYourEmailHint) {
            <mat-hint>Please check your emails and follow the link.</mat-hint>
          }
          @else if (displaySomethingWentWrongHint) {
            <mat-hint>Something went wrong, please refresh and try again.</mat-hint>
          }
          @else if (displayServerWakingUpHint) {
            <mat-hint>Our server goes to sleep sometimes, please wait...</mat-hint>
          }
        </mat-form-field>

        <button
          mat-flat-button
          type="button"
          color="primary"
          [disabled]="disableButton"
          (click)="requestLogin()"
        >
          @if (displaySendingEmailButtonText) {
            Sending email...
          } @else {
            Continue
          }
        </button>
      </form>
    </main>
  `,
})
export class LoginComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);

  disableButton = false;
  displaySendingEmailButtonText = false
  displayCheckYourEmailHint = false;
  displaySomethingWentWrongHint = false;
  displayServerWakingUpHint = false;

  emailControl = new FormControl<string>('', {
    validators: [Validators.required, Validators.email],
    nonNullable: true,
  });

  ngOnInit(): void {
    if (this.authService.isLoggedIn) {
      this.router.navigate(['/']);
    }
  }

  requestLogin(): void {
    if (!this.emailControl.valid || !this.emailControl.value) {
      return;
    }

    setTimeout(() => {
      if (!this.displayCheckYourEmailHint) {
        this.displayServerWakingUpHint = true;
      }
    }, 2500);

    this.emailControl.disable();
    this.disableButton = true;
    this.displaySendingEmailButtonText = true;

    this.authService
      .requestLogin(this.emailControl.value)
      .subscribe({
        next: () => {
          if (this.displayServerWakingUpHint) {
            this.displayServerWakingUpHint = false;
          }
          this.displaySendingEmailButtonText = false;
          this.displayCheckYourEmailHint = true;
          return;
        },
        error: () => {
          if (this.displayServerWakingUpHint) {
            this.displayServerWakingUpHint = false;
          }
          this.displaySendingEmailButtonText = false;
          this.displaySomethingWentWrongHint = true;
          return;
        },
      });
  }
}
