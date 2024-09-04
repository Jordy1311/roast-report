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
import { MatIconModule } from '@angular/material/icon';

import { AddAmendRoastFormComponent } from '../add-amend-roast-form/add-amend-roast-form.component';
import { HeaderNavigationComponent } from '../header-navigation/header-navigation.component';
import { Roast } from '../../types/roast.type';
import { RoastService } from '../../services/roast.service';
import { RoastSearchComponent } from '../roast-search/roast-search.component';
import { RoastSummaryComponent } from '../roast-summary/roast-summary.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    AddAmendRoastFormComponent,
    FormsModule,
    HeaderNavigationComponent,
    MatButtonModule,
    MatIconModule,
    RoastSearchComponent,
    RoastSummaryComponent,
  ],
  styleUrl: './dashboard.component.scss',
  template: `
    <app-header-navigation></app-header-navigation>

    <main>
      <div class="search-filter-group">
        <app-roast-search (newValue)="updateSearchValue($event)"
        ></app-roast-search>
      </div>

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

  updateSearchValue(newValue: string): void {
    this.searchText.set(newValue);
  }

  openAddRoastDialog(): void {
    this.dialog.open(AddAmendRoastFormComponent);
  }
}
