import {
  Component,
  OnInit,
  Signal,
  WritableSignal,
  computed,
  inject,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

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
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    RoastSummaryComponent,
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
      <mat-form-field class="search-input">
        <mat-label>Search roasts</mat-label>
        <input
          #searchInput
          matInput
          type="text"
          (input)="searchTextUpdated(searchInput.value)"
        />
        @if (searchText()) {
          <button
            matSuffix
            mat-icon-button
            aria-label="Clear"
            (click)="searchText() === ''"
          >
            <mat-icon>close</mat-icon>
          </button>
        }
      </mat-form-field>

      <div class="roasts">
        @for (roast of roasts(); track roast._id) {
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

  searchText: WritableSignal<string> = signal('');

  roasts: Signal<Roast[]> = computed(() => {
    const roasts = this.roastService.roastsSignal();
    return roasts.filter((roast: Roast) => {
      return Object.values(roast).some((roastValue: Roast[keyof Roast]) => {
        if (typeof roastValue === 'string') {
          return roastValue
            .toLowerCase()
            .includes(this.searchText().toLowerCase());
        }
        return false;
      });
    });
  });

  constructor(public dialog: MatDialog) {}

  ngOnInit(): void {
    this.roastService.getUsersRoasts();
  }

  logout(): void {
    this.authService.logout();
  }

  searchTextUpdated(newText: string) {
    this.searchText.set(newText);
  }

  openAddRoastDialog(): void {
    this.dialog.open(AddAmendRoastFormComponent);
  }
}
