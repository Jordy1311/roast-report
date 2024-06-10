import { Component, Input } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';

import { Roast } from '../../types/roast.type';
import { StarRatingComponent } from '../star-rating/star-rating.component';
import { DeleteConfirmationComponent } from '../delete-confirmation/delete-confirmation.component';

@Component({
  selector: 'app-roast-summary',
  standalone: true,
  imports: [ MatButtonModule, MatIconModule, StarRatingComponent ],
  styleUrl: './roast-summary.component.scss',
  template: `
    <article class="box">
      <header>
        <h2 class="title is-4">{{ roast.name }}</h2>
        <p class="subtitle is-5">{{ roast.roaster }}</p>
      </header>

      @if (roast.composition || roast.processMethod) {
        <p>{{ [roast.processMethod, roast.composition].join(', ') }}<br></p>
      }
      @if (roast.tastingNotes) {
        <p>Tastes like: {{ roast.tastingNotes!.join(', ') }}<br></p>
      }
      @if (roast.roastedFor) {
        <p>Roasted for: {{ roast.roastedFor!.join(', ') }}</p>
      }

      <div class="side-by-side">
        <button
          (click)="openDeleteRoastDialog(roast._id, roast.name)"
          mat-button
          color="warn"
          aria-label="Delete coffee"
        >
          <span>Delete</span>
          <mat-icon aria-hidden>delete</mat-icon>
        </button>
  
        @if (roast.rating) {
          <app-star-rating
            [rating]="roast.rating"
            [readonly]="true"
          ></app-star-rating>
        }
      </div>
    </article>
  `,
})
export class RoastSummaryComponent {
  constructor(public dialog: MatDialog) { }

  @Input() roast!: Roast;

  openDeleteRoastDialog(id: string, name: string): void {
    this.dialog.open(DeleteConfirmationComponent,
      { data: { roastId: id, roastName: name } }
    );
  }
}
