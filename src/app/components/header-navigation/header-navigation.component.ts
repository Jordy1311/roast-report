import { Component } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';

import { LogoutConfirmationComponent } from '../logout-confirmation/logout-confirmation.component';

@Component({
  selector: 'app-header-navigation',
  imports: [
    MatButtonModule,
    MatIconModule,
    MatToolbarModule
  ],
  styleUrl: './header-navigation.component.scss',
  template: `
    <nav>
      <mat-toolbar>
        <span>Roast Report</span>

        <span class="spacer"></span>

        <button
          (click)="openLogoutDialog()"
          mat-icon-button
          color="primary"
          aria-label="Log out"
        >
          <mat-icon class="material-symbols-rounded"> logout </mat-icon>
        </button>
      </mat-toolbar>
    </nav>
  `,
})
export class HeaderNavigationComponent {
  constructor(public dialog: MatDialog) {}

  openLogoutDialog(): void {
    this.dialog.open(LogoutConfirmationComponent);
  }
}
