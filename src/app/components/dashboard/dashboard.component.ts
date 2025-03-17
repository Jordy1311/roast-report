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
import moment from 'moment';

import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';

import { AddAmendRoastFormComponent } from '../add-amend-roast-form/add-amend-roast-form.component';
import { HeaderNavigationComponent } from '../header-navigation/header-navigation.component';
import { Roast } from '../../types/roast.type';
import { RoastService } from '../../services/roast.service';
import { RoastSearchComponent } from '../roast-search/roast-search.component';
import { RoastSummaryComponent } from '../roast-summary/roast-summary.component';

type SortFields = 'name' | 'roaster' | 'rating' | 'dateAdded' | 'dateUpdated';

@Component({
  selector: 'app-dashboard',
  imports: [
    FormsModule,
    HeaderNavigationComponent,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    RoastSearchComponent,
    RoastSummaryComponent,
  ],
  styleUrl: './dashboard.component.scss',
  template: `
    <app-header-navigation></app-header-navigation>

    <main>
      <div class="search-sort-group">
        <app-roast-search
          (newValue)="updateSearchValue($event)"
        ></app-roast-search>

        <!-- sort dropdown -->
        <mat-form-field appearance="outline">
          <mat-label>Sort</mat-label>
          <mat-select>
            <mat-option (click)="updateSortField('')"></mat-option>
            <mat-option value="Rating" (click)="updateSortField('rating')">
              Rating
            </mat-option>
            <mat-option value="Newest to oldest" (click)="updateSortField('dateAdded')">
              Newest to oldest
            </mat-option>
            <mat-option value="Recently updated" (click)="updateSortField('dateUpdated')">
              Recently updated
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

      <mat-paginator
        (page)="handleChangePageEvent($event)"
        [length]="roastsWithSearchSort().length"
        [pageSize]="pageSize()"
        [pageIndex]="pageIndex()"
        [hidePageSize]="isMobileDevice()"
        [pageSizeOptions]="[5,10,25,50]"
        aria-label="Select page"
      >
      </mat-paginator>

      <div class="roasts-container">
        @for (roast of roastsSlicedByPaginator(); track roast._id) {
          <app-roast-summary [roast]="roast"></app-roast-summary>
        }
        @if (!roastService.roastsSignal().length) {
          <mat-spinner [diameter]="32"></mat-spinner>
        }

      </div>

      <button
        (click)="openAddRoastDialog($event)"
        mat-fab extended
        class="add-roast"
        aria-label="Add coffee"
      >
        <span>{{ isMobileDevice() ? 'Add' : 'Add a coffee' }}</span>
        <mat-icon class="material-symbols-rounded" aria-hidden>
          add_circle
        </mat-icon>
      </button>
    </main>
  `,
})
export class DashboardComponent implements OnInit {
  protected roastService = inject(RoastService);
  private dialog = inject(MatDialog);

  searchText: WritableSignal<string> = signal('');
  sortField: WritableSignal<SortFields | ''> = signal('');

  pageIndex = signal(0);
  pageSize = signal(10);

  roastsWithSearchSort: Signal<Roast[]> = computed(() => {
    // computed signal dependencies
    const roasts = this.roastService.roastsSignal()
    const searchTextLowerCased = this.searchText().toLowerCase();
    const sortField = this.sortField();

    console.log({ roasts });

    let filteredRoasts;

    if (searchTextLowerCased) {
      filteredRoasts = this.search(roasts, searchTextLowerCased);
    }

    if (sortField) {
      filteredRoasts = this.sort(filteredRoasts || roasts, sortField);
    }

    return (filteredRoasts || roasts);
  });

  roastsSlicedByPaginator: Signal<Roast[]> = computed(() => {
    // computed signal dependencies
    const roastsWithSearchSort = this.roastsWithSearchSort();
    const pageIndex = this.pageIndex();
    const pageSize = this.pageSize();

    const startIndex = pageIndex * pageSize;
    const endIndex = startIndex + pageSize;

    return roastsWithSearchSort.slice(startIndex, endIndex);
  });

  ngOnInit(): void {
    this.roastService.getUsersRoasts();
  }

  openAddRoastDialog(event: Event): void {
    event.preventDefault();
    this.dialog.open(AddAmendRoastFormComponent);
  }

  updateSearchValue(newValue: string): void {
    this.searchText.set(newValue);
    this.pageIndex.set(0);
  }

  updateSortField(newSortField: SortFields | ''): void {
    this.sortField.set(newSortField);
    this.pageIndex.set(0);
  }

  search(roasts: Roast[], searchTerm: string): Roast[] {
    return roasts.filter((roast: Roast) => {
      return Object
        .values(roast) // one roast's values
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
    switch (fieldToSort) {
      case 'rating':
        return roasts.toSorted((a: Roast, b: Roast) => {
          if (a.rating && b.rating) return b.rating - a.rating;
          if (a.rating) return -1;
          if (b.rating) return 1;
          return 1;
        });

      case 'dateAdded':
        return roasts.toSorted((a: Roast, b: Roast) => {
          if (moment(a.createdAt).isBefore(moment(b.createdAt))) return -1;
          return 1;
        });

      case 'dateUpdated':
        return roasts.toSorted((a: Roast, b: Roast) => {
          if (moment(a.updatedAt).isBefore(moment(b.updatedAt))) return -1;
          return 1;
        });

      case 'name':
      case 'roaster':
        return roasts.toSorted((a: Roast, b: Roast) =>
          a[ fieldToSort ].localeCompare(b[ fieldToSort ])
        );

      default:
        return roasts;
    }
  }

  handleChangePageEvent(event: PageEvent) {
    this.pageIndex.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
  }

  isMobileDevice(): boolean {
    return window.innerWidth <= 480;
  }
}
