import { Component, OnInit, inject } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';

import { AuthService } from '../../services/auth.service';
import { RoastService } from '../../services/roast.service';
import { AddAmendRoastFormComponent } from '../add-amend-roast-form/add-amend-roast-form.component';
import { RoastSummaryComponent } from '../roast-summary/roast-summary.component';
import { Roast } from '../../types/roast.type';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    AddAmendRoastFormComponent,
    RoastSummaryComponent,
    MatButtonModule,
    MatIconModule,
  ],
  styleUrl: './dashboard.component.scss',
  template: `
    <header>
      <h1>Roast Report</h1>
      <div>
        <button (click)="logout()" mat-stroked-button color="primary">
          <span>Log out</span>
          <mat-icon class="material-symbols-rounded" aria-hidden>
            logout
          </mat-icon>
        </button>
      </div>
    </header>

    <main>
      <div class="roasts">
        @for (roast of usersRoasts(); track roast._id) {
          <app-roast-summary [roast]="roast"></app-roast-summary>
        }
      </div>

      <button
        (click)="openAddAmendRoastDialog()"
        mat-flat-button
        color="primary"
        class="add-roast"
        aria-label="Add coffee"
      >
        <span>Add Roast</span>
        <mat-icon class="material-symbols-rounded" aria-hidden>
          add_circle
        </mat-icon>
      </button>
    </main>
  `,
})
export class DashboardComponent implements OnInit {
  private authService = inject(AuthService);
  private roastService = inject(RoastService);

  usersRoasts = this.roastService.roastsSignal;

  constructor(public dialog: MatDialog) {}

  ngOnInit(): void {
    this.roastService.getUsersRoasts();
  }

  logout(): void {
    this.authService.logout();
  }

  openAddAmendsRoastDialog(roastToUpdate?: Roast): void {
    if (roastToUpdate) {
      this.dialog.open(AddAmendRoastFormComponent, { data: roastToUpdate });
    } else {
      this.dialog.open(AddAmendRoastFormComponent);
    }
  }
}
