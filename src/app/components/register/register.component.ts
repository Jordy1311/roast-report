import { Component, inject, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  FormGroupDirective,
  NgForm,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { ErrorStateMatcher } from '@angular/material/core';

// This thing tells the AM-form-field to show / hide an error
export class PasswordsEqualMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const confirmPassword = control!.value;
    const password = form?.form.controls['password'].value;
    const passwordsAreEqual = confirmPassword === password;
    const passwordsAreNotEqual = !passwordsAreEqual && (control?.dirty || control?.touched);

    return !!(passwordsAreNotEqual || form?.submitted);
  }
}

// This thing specifies when error is passwordMissmatch
const passwordsAreEqualValidator: ValidatorFn = (
  control: AbstractControl
): ValidationErrors | null => {
  const password = control!.value.password;
  const confirmPassword = control!.value.confirmPassword;
  const passwordsAreEqual = password === confirmPassword

  return passwordsAreEqual ? null : { passwordMissmatch: true };
};

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

      <form [formGroup]="newUser">
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
          @if (email!.hasError('required')) {
            <mat-error>Please enter your email address.</mat-error>
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

          @if (password!.hasError('required')) {
            <mat-error>Please enter a password</mat-error>
          }
        </mat-form-field>

        <mat-form-field appearance="outline">
          <mat-label>Confirm Password</mat-label>
          <input
            matInput
            id="confirmPassword"
            type="password"
            formControlName="confirmPassword"
            [errorStateMatcher]="passwordsEqualMatcher"
          />

          @if (confirmPassword!.hasError('required')) {
            <mat-error>Please confirm your password.</mat-error>
          } @else if (newUser.errors?.['passwordMissmatch']) {
            <mat-error>Passwords don't match.</mat-error>
          }
        </mat-form-field>

        <button (click)="register()" mat-flat-button color="primary">
          Sign up
        </button>
      </form>
    </div>
  `,
})
export class RegisterComponent implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);

  passwordsEqualMatcher = new PasswordsEqualMatcher();

  newUser = new FormGroup(
    {
      email: new FormControl<string>('', {
        validators: [Validators.required, Validators.email],
        nonNullable: true,
      }),
      password: new FormControl<string>('', {
        validators: [Validators.required],
        nonNullable: true,
      }),
      confirmPassword: new FormControl<string>('', {
        validators: [Validators.required],
        nonNullable: true,
      }),
    }, { validators: passwordsAreEqualValidator }
  );

  public get email() {
    return this.newUser.get('email');
  }

  public get password() {
    return this.newUser.get('password');
  }

  public get confirmPassword() {
    return this.newUser.get('confirmPassword');
  }

  ngOnInit(): void {
   if (this.authService.isLoggedIn) {
     this.router.navigate(['/']);
   }
  }

  register(): void {
    console.log('register method in RegisterComponent fired');
  }
}
