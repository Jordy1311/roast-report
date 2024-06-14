import { Component, OnInit, inject } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';

import { AuthService } from '../../services/auth.service';
import { RoastService } from '../../services/roast.service';
import { RoastSummaryComponent } from '../roast-summary/roast-summary.component';
import { AddRoastFormComponent } from '../add-roast-form/add-roast-form.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [ RoastSummaryComponent, AddRoastFormComponent, MatButtonModule, MatIconModule ],
  styleUrl: './dashboard.component.scss',
  template: `
    <header>
      <h1>Roast Report</h1>
      <div>
        <button
          (click)="logout()"
          mat-stroked-button
          color="primary"
        >
          <span>Log out</span>
          <mat-icon
            class="material-symbols-rounded"
            aria-hidden
          >
            logout
          </mat-icon>
        </button>
      </div>
    </header>

    <!-- TODO: make this a thing again -->
    <!-- <div class="stats mx-auto level is-mobile">
      <div class="level-item has-text-centered">
        <div>
          <p class="heading">Roasts</p>
          <p class="title">{{ usersRoasts().length }}</p>
        </div>
      </div>
      <div class="level-item has-text-centered">
        <div>
          <p class="heading">Roasters</p>
          <p class="title">{{ numberOfUniqueRoasters }}</p>
        </div>
      </div>
    </div> -->

    <main>
      <div class="roasts">
        @for (roast of usersRoasts(); track roast._id) {
          <app-roast-summary [roast]="roast"></app-roast-summary>
        }
      </div>

      <button
        (click)="openAddRoastDialog()"
        mat-flat-button
        color="primary"
        class="add-roast"
        aria-label="Add coffee"
      >
        <span>Add Roast</span>
        <mat-icon
          class="material-symbols-rounded"
          aria-hidden
        >
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

  get numberOfUniqueRoasters(): number {
    return new Set(
      this.usersRoasts().map((roast) => roast.roaster)
    ).size;
  }

  logout(): void {
    this.authService.logout();
  }

  openAddRoastDialog(): void {
    this.dialog.open(AddRoastFormComponent);
  }
}
