import { Component, EventEmitter, Input, Output } from '@angular/core';

import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-star-rating',
  standalone: true,
  imports: [ MatIcon ],
  styleUrl: './star-rating.component.scss',
  template: `
    <div class="container" [class.readonly]="readonly">
      <mat-icon
        fontIcon="close"
        (click)="setRating(0)"
        class="remove-rating"
        aria-hidden="false"
        aria-label="Choose to not specify a rating"
      ></mat-icon>

      <mat-icon
        fontIcon="star"
        (click)="setRating(1)"
        [class.rated]="rating >= 1"
        aria-hidden="false"
        aria-label="One star out of five"
      ></mat-icon>

      <mat-icon
        fontIcon="star"
        (click)="setRating(2)"
        [class.rated]="rating >= 2"
        aria-hidden="false"
        aria-label="Two stars out of five"
      ></mat-icon>

      <mat-icon
        fontIcon="star"
        (click)="setRating(3)"
        [class.rated]="rating >= 3"
        aria-hidden="false"
        aria-label="Two stars out of five"
      ></mat-icon>

      <mat-icon
        fontIcon="star"
        (click)="setRating(4)"
        [class.rated]="rating >= 4"
        aria-hidden="false"
        aria-label="Two stars out of five"
      ></mat-icon>

      <mat-icon
        fontIcon="star"
        (click)="setRating(5)"
        [class.rated]="rating >= 5"
        aria-hidden="false"
        aria-label="Two stars out of five"
      ></mat-icon>
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
