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
import { MatSelectModule } from '@angular/material/select';

import { AddAmendRoastFormComponent } from '../add-amend-roast-form/add-amend-roast-form.component';
import { HeaderNavigationComponent } from '../header-navigation/header-navigation.component';
import { Roast } from '../../types/roast.type';
import { RoastService } from '../../services/roast.service';
import { RoastSearchComponent } from '../roast-search/roast-search.component';
import { RoastSummaryComponent } from '../roast-summary/roast-summary.component';

type SortFields = 'name' | 'roaster' | 'rating';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    AddAmendRoastFormComponent,
    FormsModule,
    HeaderNavigationComponent,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    RoastSearchComponent,
    RoastSummaryComponent,
  ],
  styleUrl: './dashboard.component.scss',
  template: `
    <app-header-navigation></app-header-navigation>

    <main>
      <div class="search-filter-group">
        <app-roast-search
          (newValue)="updateSearchValue($event)"
        ></app-roast-search>

        <mat-form-field appearance="outline">
          <mat-label>Sort</mat-label>
          <mat-select>
            <mat-option (click)="updateSortField('')"></mat-option>

            <mat-option value="Rating" (click)="updateSortField('rating')">
              Rating
            </mat-option>

            <mat-option value="Name" (click)="updateSortField('name')">
              Name
            </mat-option>

            <mat-option value="Roaster" (click)="updateSortField('roaster')">
              Roaster
            </mat-option>
          </mat-select>
        </mat-form-field>
      </div>

      <div class="roasts-container">
        @for (roast of roasts(); track roast._id) {
          <app-roast-summary [roast]="roast"></app-roast-summary>
        }
      </div>

      <button
        (click)="openAddRoastDialog($event)"
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
  sortField: WritableSignal<SortFields | ''> = signal('');

  roasts: Signal<Roast[]> = computed(() => {
    // computed signal dependencies
    const roasts = this.roastService.roastsSignal();
    const searchTextLowerCased = this.searchText().toLowerCase();
    const sortField = this.sortField();

    let filteredRoasts;

    if (searchTextLowerCased) {
      filteredRoasts = this.search(roasts, searchTextLowerCased);
    }

    if (sortField) {
      filteredRoasts = this.sort(filteredRoasts || roasts, sortField);
    }

    return filteredRoasts || roasts;
  });

  constructor(public dialog: MatDialog) {}

  ngOnInit(): void {
    this.roastService.getUsersRoasts();
  }

  openAddRoastDialog(event: Event): void {
    event.preventDefault();
    this.dialog.open(AddAmendRoastFormComponent);
  }

  updateSearchValue(newValue: string): void {
    this.searchText.set(newValue);
  }

  updateSortField(newSortField: SortFields | ''): void {
    this.sortField.set(newSortField);
  }

  search(roasts: Roast[], searchTerm: string): Roast[] {
    return roasts.filter((roast: Roast) => {
      return Object
        .values(roast) // an array of one roast's values
        .some((roastValue: Roast[keyof Roast]) => {
          if (typeof roastValue === 'string') {
            return roastValue.toLowerCase().includes(searchTerm);
          }

          if (Array.isArray(roastValue) && roastValue[0]) {
            return roastValue.some((arrayItem) => {
              return arrayItem.toLowerCase().includes(searchTerm);
            });
          }

          return false;
        });
    });
  }

  sort(roasts: Roast[], fieldToSort: SortFields): Roast[] {
    if (fieldToSort === 'name' || fieldToSort === 'roaster') {
      return roasts.toSorted((a: Roast, b: Roast) =>
        a[fieldToSort].localeCompare(b[fieldToSort])
      );
    }

    if (fieldToSort === 'rating') {
      return roasts.toSorted((a: Roast, b: Roast) => {
        if (a.rating && b.rating) return b.rating - a.rating;

        if (a.rating) return -1;
        if (b.rating) return 1;

        return 1;
      });
    }

    return roasts;
  }
}
