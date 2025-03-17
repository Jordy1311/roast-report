import { Component, EventEmitter, Input, Output } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-star-rating',
  imports: [
    MatIcon,
    MatButtonModule
  ],
  styleUrl: './star-rating.component.scss',
  template: `
    <div class="container" [class.readonly]="readonly">
      <button
        mat-icon-button
        (click)="setRating(1)"
        [disabled]="readonly"
        aria-label="One star out of five"
      >
        <mat-icon
          class="material-symbols-rounded"
          [class.rated]="rating >= 1"
          aria-hidden="true"
        >
          star
        </mat-icon>
      </button>

      <button
        mat-icon-button
        (click)="setRating(2)"
        [disabled]="readonly"
        aria-label="Two stars out of five"
      >
        <mat-icon
          class="material-symbols-rounded"
          [class.rated]="rating >= 2"
          aria-hidden="true"
        >
          star
        </mat-icon>
      </button>

      <button
        mat-icon-button
        (click)="setRating(3)"
        [disabled]="readonly"
        aria-label="Three stars out of five"
      >
        <mat-icon
          class="material-symbols-rounded"
          [class.rated]="rating >= 3"
          aria-hidden="true"
        >
          star
        </mat-icon>
      </button>

      <button
        mat-icon-button
        (click)="setRating(4)"
        [disabled]="readonly"
        aria-label="Four stars out of five"
      >
        <mat-icon
          class="material-symbols-rounded"
          [class.rated]="rating >= 4"
          aria-hidden="true"
        >
          star
        </mat-icon>
      </button>

      <button
        mat-icon-button
        (click)="setRating(5)"
        [disabled]="readonly"
        aria-label="Five stars out of five"
      >
        <mat-icon
          class="material-symbols-rounded"
          [class.rated]="rating >= 5"
          aria-hidden="true"
        >
          star
        </mat-icon>
      </button>

      <br/>

      @if (!readonly) {
        <button
          mat-icon-button
          (click)="setRating(0)"
          [disabled]="readonly"
          aria-label="Choose to not specify a rating"
        >
          <mat-icon class="material-symbols-rounded" aria-hidden="true">
            cancel
          </mat-icon>
        </button>
      }
    </div>
  `,
})
export class StarRatingComponent {
  @Input() rating = 0;
  @Input() readonly = false;

  @Output() valueChanged = new EventEmitter<number>();

  setRating(value: number): void {
    if (this.readonly || this.rating === value) return;

    this.rating = value;
    this.valueChanged.emit(this.rating);
  }
}
