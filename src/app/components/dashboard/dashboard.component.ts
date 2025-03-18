import {
  Component,
  OnInit,
  Signal,
  WritableSignal,
  computed,
  inject,
  signal,
} from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
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
  animations: [
    trigger('showHide', [
      state(
        'show',
        style({
          display: 'inline-flex',
          opacity: 1,
          transform: 'translateY(0)',
        }),
      ),
      state(
        'hide',
        style({
          display: 'none',
          opacity: 0,
          transform: 'translateY(100%)',
        }),
      ),
      transition('show => hide', [animate('200ms ease-in')]),
      transition('hide => show', [animate('100ms ease-out')]),
    ]),
  ],
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
            <mat-option value="Name" (click)="updateSortField('name')">
              Name
            </mat-option>
            <mat-option value="Roaster" (click)="updateSortField('roaster')">
              Roaster
            </mat-option>
            <mat-option value="Rating" (click)="updateSortField('rating')">
              Rating
            </mat-option>
            <mat-option value="Newest to oldest" (click)="updateSortField('dateAdded')">
              Oldest to newest
            </mat-option>
            <mat-option value="Recently updated" (click)="updateSortField('dateUpdated')">
              Recently updated
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
        [pageSizeOptions]="[6,10,24,50]"
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
        [@showHide]="isAddButtonHidden ? 'hide' : 'show'"
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

  private searchText: WritableSignal<string> = signal('');
  private sortField: WritableSignal<SortFields | ''> = signal('');

  protected pageIndex = signal(0);
  protected pageSize = signal(10);

  protected isAddButtonHidden = false;
  private lastScrollTop = 0;

  protected roastsWithSearchSort: Signal<Roast[]> = computed(() => {
    // computed signal dependencies
    const roasts = this.roastService.roastsSignal()
    const searchTextLowerCased = this.searchText().toLowerCase();
    const sortField = this.sortField();

    let filteredRoasts;

    if (searchTextLowerCased) {
      filteredRoasts = this.search(roasts, searchTextLowerCased);
    }

    if (sortField) {
      filteredRoasts = this.sort(filteredRoasts || roasts, sortField);
    }

    return (filteredRoasts || roasts);
  });

  protected roastsSlicedByPaginator: Signal<Roast[]> = computed(() => {
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
    this.setupScrollListener();
  }

  private setupScrollListener(): void {
    window.addEventListener('scroll', () => {
      const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      this.isAddButtonHidden = scrollTop > this.lastScrollTop;
      this.lastScrollTop = scrollTop <= 0 ? 0 : scrollTop;
    });
  }

  protected openAddRoastDialog(event: Event): void {
    event.preventDefault();
    this.dialog.open(AddAmendRoastFormComponent);
  }

  protected updateSearchValue(newValue: string): void {
    this.searchText.set(newValue);
    this.pageIndex.set(0);
  }

  protected updateSortField(newSortField: SortFields | ''): void {
    this.sortField.set(newSortField);
    this.pageIndex.set(0);
  }

  private search(roasts: Roast[], searchTerm: string): Roast[] {
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

  private sort(roasts: Roast[], fieldToSort: SortFields): Roast[] {
    switch (fieldToSort) {
      case 'name':
      case 'roaster':
        return roasts.toSorted((a: Roast, b: Roast) =>
          a[fieldToSort].localeCompare(b[fieldToSort])
        );

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
          if (moment(a.updatedAt).isBefore(moment(b.updatedAt))) return 1;
          return -1;
        });

      default:
        return roasts;
    }
  }

  protected handleChangePageEvent(event: PageEvent) {
    this.pageIndex.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
  }

  protected isMobileDevice(): boolean {
    return window.innerWidth <= 480;
  }
}
