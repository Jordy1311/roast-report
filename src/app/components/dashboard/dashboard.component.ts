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

import _ from 'lodash';

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
            <mat-option (click)="changeSortValue()"></mat-option>

            <mat-option value="Rating" (click)="changeSortValue('rating')">
              Rating
            </mat-option>

            <mat-option value="Name" (click)="changeSortValue('name')">
              Name
            </mat-option>

            <mat-option value="Roaster" (click)="changeSortValue('roaster')">
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
  sortValue: WritableSignal<string | undefined> = signal('');

  roasts: Signal<Roast[]> = computed(() => {
    const roasts = this.roastService.roastsSignal();
    const searchTextLowerCased = this.searchText().toLowerCase();
    const sortValue = this.sortValue();

    const filteredRoasts = roasts.filter((roast: Roast) => {
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

    if (sortValue === 'name' || sortValue === 'roaster') {
      return _.sortBy(filteredRoasts, [(i: any) => i[sortValue]]);
    }

    if (sortValue === 'rating') {
      return _.sortBy(filteredRoasts, [(i: any) => i[sortValue]]).reverse();
    }

    return filteredRoasts;
  });

  constructor(public dialog: MatDialog) {}

  ngOnInit(): void {
    this.roastService.getUsersRoasts();
  }

  updateSearchValue(newValue: string): void {
    this.searchText.set(newValue);
  }

  changeSortValue(sortingOn?: 'rating' | 'name' | 'roaster'): void {
    this.sortValue.set(sortingOn);
  }

  openAddRoastDialog(): void {
    this.dialog.open(AddAmendRoastFormComponent);
  }
}
