import { Component, inject } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatDialogActions, MatDialogContent, MatDialogRef, MatDialogTitle } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-logout-confirmation',
  imports: [
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatButtonModule,
    MatIconModule,
  ],
  styleUrl: './logout-confirmation.component.scss',
  template: `
    <h2 mat-dialog-title>Logout?</h2>

    <mat-dialog-content>
      <p>Are you sure you want to logout?</p>
    </mat-dialog-content>

    <mat-dialog-actions>
      <button cdkFocusInitial (click)="closeDialog()" mat-button>No</button>

      <button (click)="logout()" mat-flat-button color="primary">
        Logout
        <mat-icon class="material-symbols-rounded" aria-hidden>
          logout
        </mat-icon>
      </button>
    </mat-dialog-actions>
  `,
})
export class LogoutConfirmationComponent {
  private authService = inject(AuthService);

  constructor(public dialogRef: MatDialogRef<LogoutConfirmationComponent>) {}

  closeDialog(): void {
    this.dialogRef.close();
  }

  logout(): void {
    this.authService.logout();
  }
}
