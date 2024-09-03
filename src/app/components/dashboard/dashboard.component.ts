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
import { MatToolbarModule } from '@angular/material/toolbar';

import { AddAmendRoastFormComponent } from '../add-amend-roast-form/add-amend-roast-form.component';
import { LogoutConfirmationComponent } from '../logout-confirmation/logout-confirmation.component';
import { Roast } from '../../types/roast.type';
import { RoastService } from '../../services/roast.service';
import { RoastSummaryComponent } from '../roast-summary/roast-summary.component';

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
    MatToolbarModule,
    RoastSummaryComponent,
  ],
  styleUrl: './dashboard.component.scss',
  template: `
    <mat-toolbar>
      <span>Roast Report</span>

      <span class="spacer"></span>

      <button
        (click)="openLogoutDialog()"
        mat-icon-button
        class="logout"
        color="primary"
        aria-label="Log out"
      >
        <mat-icon class="material-symbols-rounded">
          logout
        </mat-icon>
      </button>
    </mat-toolbar>

    <main>
      <mat-form-field class="search-input" appearance="outline">
        <mat-label>Search roasts</mat-label>
        <mat-icon matPrefix>search</mat-icon>
        <input
          #searchInput
          matInput
          type="text"
          (input)="searchTextUpdated(searchInput.value)"
          (keyup.escape)="clearSearchText(searchInput)"
        />
        @if (searchText()) {
          <button
            matSuffix
            mat-icon-button
            aria-label="Clear"
            (click)="clearSearchText(searchInput)"
          >
            <mat-icon>close</mat-icon>
          </button>
        }
      </mat-form-field>

      <div class="roasts-container">
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
        <span>Add</span>
        <mat-icon class="material-symbols-rounded" aria-hidden>
          add_circle
        </mat-icon>
      </button>
    </main>
  `,
})
export class DashboardComponent implements OnInit {
  private roastService = inject(RoastService);

  searchText: WritableSignal<string> = signal('');

  roasts: Signal<Roast[]> = computed(() => {
    const roasts = this.roastService.roastsSignal();
    const searchTextLowerCased = this.searchText().toLowerCase();

    return roasts.filter((roast: Roast) => {
      return Object.values(roast).some((roastValue: Roast[keyof Roast]) => {
        if (typeof roastValue === 'string') {
          return roastValue.toLowerCase().includes(searchTextLowerCased);
        }
        if (Array.isArray(roastValue) && typeof roastValue[0] === 'string') {
          return roastValue.some((arrayItem) => {
            return arrayItem.toLowerCase().includes(searchTextLowerCased);
          });
        }
        return false;
      });
    });
  });

  constructor(public dialog: MatDialog) {}

  ngOnInit(): void {
    this.roastService.getUsersRoasts();
  }

  openLogoutDialog(): void {
    this.dialog.open(LogoutConfirmationComponent);
  }

  clearSearchText(searchInput: HTMLInputElement): void {
    searchInput.value = '';
    this.searchText.set('');
  }

  searchTextUpdated(newText: string) {
    this.searchText.set(newText);
  }

  openAddRoastDialog(): void {
    this.dialog.open(AddAmendRoastFormComponent);
  }
}
