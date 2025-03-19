import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import {
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Subscription } from 'rxjs';

import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

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
        <img
          src="/assets/drip-coffee.svg"
          height="72"
          width="72"
          alt="Drip coffee icon"
          loading="lazy"
          />
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
export class LoginComponent implements OnInit, OnDestroy {
  private authService = inject(AuthService);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  readonly SnackBarOptions: MatSnackBarConfig = {
    verticalPosition: 'top',
    horizontalPosition: 'center',
  }

  protected disableButton = false;
  protected displaySendingEmailButtonText = false
  protected isServerSleeping = false;

  private authServiceLoginSubscription?: Subscription;

  protected emailControl = new FormControl<string>('', {
    validators: [Validators.required, Validators.email],
    nonNullable: true,
  });

  ngOnInit(): void {
    if (this.authService.isLoggedIn) {
      this.router.navigate(['/']);
    }
  }

  ngOnDestroy(): void {
    this.authServiceLoginSubscription?.unsubscribe();
  }

  protected requestLogin(): void {
    if (!this.emailControl.valid || !this.emailControl.value) {
      return;
    }

    // assume so until we hear otherwise
    this.isServerSleeping = true;

    // if we dont hear back in time provide feedback to user
    // we're waiting for the server to wake up
    setTimeout(() => {
      if (this.isServerSleeping) {
        this.snackBar.open(
          'Waking up server, please wait...',
          'Sweet!',
          this.SnackBarOptions
        );
      }
    }, 3000);

    this.emailControl.disable();
    this.disableButton = true;
    this.displaySendingEmailButtonText = true;

    this.authServiceLoginSubscription = this.authService
      .requestLogin(this.emailControl.value)
      .subscribe({
        next: () => {
          this.displaySendingEmailButtonText = false;
          this.isServerSleeping = false;

          this.snackBar.open(
            'We\'ve emailed your login link!',
            'Sweet!',
            this.SnackBarOptions
          );
          return;
        },
        error: () => {
          this.displaySendingEmailButtonText = false;
          this.isServerSleeping = false;

          this.snackBar.open(
            'An error occurred, please refresh and try again.',
            undefined,
            this.SnackBarOptions
          );
          return;
        },
      });
  }
}
