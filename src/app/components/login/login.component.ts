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
import { AlertService } from '../../services/alert.service';

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
export class LoginComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);
  private alertService = inject(AlertService);

  protected disableButton = false;
  protected displaySendingEmailButtonText = false

  protected emailControl = new FormControl<string>('', {
    validators: [Validators.required, Validators.email],
    nonNullable: true,
  });

  ngOnInit(): void {
    if (this.authService.isLoggedIn) {
      this.router.navigate(['/']);
    }
  }

  protected requestLogin(): void {
    if (!this.emailControl.valid || !this.emailControl.value) {
      return;
    }

    // if we dont hear back in time provide feedback to user
    // we're waiting for the server to wake up
    const uiFeedbackTimeoutId = setTimeout(() => {
      this.alertService.showOnly('Waking up server, please wait...');
    }, 3000);

    this.emailControl.disable();
    this.disableButton = true;
    this.displaySendingEmailButtonText = true;

    this.authService
      .requestLogin(this.emailControl.value)
      .then(() => {
        this.displaySendingEmailButtonText = false;
        clearTimeout(uiFeedbackTimeoutId);

        this.alertService.showOnly(
          'We\'ve emailed your login link!',
          'Sweet!',
        );
      })
      .catch(() => {
        this.displaySendingEmailButtonText = false;
        clearTimeout(uiFeedbackTimeoutId);
      });
  }
}
