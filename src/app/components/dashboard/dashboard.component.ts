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
import { AlertService } from '../../services/alert.service';
import { HeaderNavigationComponent } from '../header-navigation/header-navigation.component';
import { Roast } from '../../types/roast.type';
import { RoastService } from '../../services/roast.service';
import { RoastSearchComponent } from '../roast-search/roast-search.component';
import { RoastSummaryComponent } from '../roast-summary/roast-summary.component';

type SortFields = 'name' | 'roaster' | 'rating' | 'oldestToNewest' | 'recentlyUpdated';

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
      transition('show => hide', [animate('250ms ease-in')]),
      transition('hide => show', [animate('150ms ease-out')]),
    ]),
  ],
  template: `
    <app-header-navigation></app-header-navigation>

    <main>
      <div class="search-sort-group">
        <app-roast-search
          (newValue)="updateSearchField($event)"
          [value]="searchField"
        ></app-roast-search>

        <!-- sort dropdown -->
        <mat-form-field appearance="outline">
          <mat-label>Sort</mat-label>
          <mat-select [(ngModel)]="sortField" (selectionChange)="updateSortField()">
            @for (sortField of sortFields; track sortField) {
              <mat-option [value]="sortField.value">
                {{ sortField.viewValue }}
              </mat-option>
            }
          </mat-select>
        </mat-form-field>
      </div>

      <div class="clear-and-paginator">
        <button
          mat-button
          [disabled]="disableClearFilters()"
          (click)="clearFilters()"
        >Clear filters</button>

        <mat-paginator
          (page)="handleChangePageEvent($event)"
          [length]="roastsWithSearchSort().length"
          [pageSize]="pageSize()"
          [pageIndex]="pageIndex()"
          [hidePageSize]="isTabletDevice()"
          [pageSizeOptions]="[6,10,24,50]"
          aria-label="Select page"
        >
        </mat-paginator>
      </div>

      <div class="roasts-container">
        @for (roast of roastsSlicedByPaginator(); track roast._id) {
          <app-roast-summary [roast]="roast"></app-roast-summary>
        }
        @if (requestingRoasts) {
          <mat-spinner [diameter]="32"></mat-spinner>
        }
      </div>

      <button
        (click)="openAddRoastDialog($event)"
        mat-fab extended
        class="add-roast"
        [@showHide]="isAddButtonHidden || requestingRoasts ? 'hide' : 'show'"
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
  private alertService = inject(AlertService);

  readonly sortFields: { value: SortFields | '', viewValue: string }[] = [
    { value: '', viewValue: '-' },
    { value: 'name', viewValue: 'Name' },
    { value: 'roaster', viewValue: 'Roaster' },
    { value: 'rating', viewValue: 'Rating' },
    { value: 'oldestToNewest', viewValue: 'Oldest to newest' },
    { value: 'recentlyUpdated', viewValue: 'Recently updated' }
  ];
  protected sortField: SortFields | '' = '';
  private sortFieldSignal: WritableSignal<SortFields | ''> = signal('');

  protected searchField: string = '';
  private searchTextSignal: WritableSignal<string> = signal('');

  protected pageIndex = signal(0);
  protected pageSize = signal(10);

  protected isAddButtonHidden = false;
  protected requestingRoasts = false;
  private lastScrollTop = 0;

  protected roastsWithSearchSort: Signal<Roast[]> = computed(() => {
    // computed signal dependencies
    const roasts = this.roastService.roastsSignal()
    const searchTextLowerCased = this.searchTextSignal().toLowerCase();
    const sortFieldSignalValue = this.sortFieldSignal();

    let filteredRoasts;

    if (searchTextLowerCased) {
      filteredRoasts = this.search(roasts, searchTextLowerCased);
    }

    if (sortFieldSignalValue) {
      filteredRoasts = this.sort(filteredRoasts || roasts, sortFieldSignalValue);
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

  protected disableClearFilters: Signal<boolean> = computed(() => {
    // computed signal dependencies
    const sortField = this.sortFieldSignal();
    const searchField = this.searchTextSignal();
    return !sortField && !searchField;
  });

  ngOnInit(): void {
    // if we have been waiting for the request for some time
    // show the user some feedback
    const uiFeedbackTimeoutId = setTimeout(() => {
      this.alertService.showOnly('Waking up server, please wait...');
    }, 3000);

    this.requestingRoasts = true;
    this.roastService.getUsersRoasts()
      .then(() => {
        this.requestingRoasts = false;
        clearTimeout(uiFeedbackTimeoutId);
      })
      .catch(() => clearTimeout(uiFeedbackTimeoutId));

    const storedSortField = localStorage.getItem('sortField') as SortFields | '';
    if (storedSortField) {
      this.sortField = storedSortField;
      // false because we have just retreived from localStorage
      this.updateSortField(false);
    }

    const storedSearchField = localStorage.getItem('searchField');
    if (storedSearchField) {
      // false because we have just retreived from localStorage
      this.updateSearchField(storedSearchField, false);
    }

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

  protected updateSearchField(newValue: string, saveToLocalStorage = true): void {
    this.searchTextSignal.set(newValue);
    this.searchField = newValue;
    this.pageIndex.set(0);

    if (!saveToLocalStorage) return;

    if (newValue !== '') {
      localStorage.setItem('searchField', newValue);
    } else {
      localStorage.removeItem('searchField');
    }
  }

  protected updateSortField(saveToLocalStorage = true): void {
    this.sortFieldSignal.set(this.sortField);
    this.pageIndex.set(0);

    if (!saveToLocalStorage) return;

    if (this.sortField !== '') {
      localStorage.setItem('sortField', this.sortField);
    } else {
      localStorage.removeItem('sortField');
    }
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

      case 'recentlyUpdated':
        return roasts.toSorted((a: Roast, b: Roast) => {
          if (moment(a.updatedAt).isBefore(moment(b.updatedAt))) return 1;
          return -1;
        });

      case 'oldestToNewest':
        return roasts.toSorted((a: Roast, b: Roast) => {
          if (moment(a.createdAt).isBefore(moment(b.createdAt))) return -1;
          return 1;
        });

      default:
        return roasts;
    }
  }

  protected clearFilters(): void  {
    this.sortFieldSignal.set('');
    this.sortField = '';
    this.searchTextSignal.set('');
    this.searchField = '';
    localStorage.removeItem('sortField');
    localStorage.removeItem('searchField');
  }

  protected handleChangePageEvent(event: PageEvent) {
    this.pageIndex.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
  }

  protected isMobileDevice(): boolean {
    return window.innerWidth <= 500;
  }
  protected isTabletDevice(): boolean {
    return window.innerWidth <= 700;
  }
}
