import { Component, inject } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';

import { LogoutConfirmationComponent } from '../modals/logout-confirmation/logout-confirmation.component';

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
        <img
          src="/assets/drip-coffee.svg"
          height="32"
          width="32"
          alt="Drip coffee icon"
          loading="lazy"
          />

        <span class="spacer"></span>

        <button
          (click)="openLogoutDialog()"
          mat-icon-button
          color="primary"
          aria-label="Log out"
        >
          <mat-icon class="material-symbols-rounded">logout</mat-icon>
        </button>
      </mat-toolbar>
    </nav>
  `,
})
export class HeaderNavigationComponent {
  private dialog = inject(MatDialog);

  openLogoutDialog(): void {
    this.dialog.open(LogoutConfirmationComponent);
  }
}
