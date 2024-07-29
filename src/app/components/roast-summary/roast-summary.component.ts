import { Component, Input } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

import { Roast } from '../../types/roast.type';
import { StarRatingComponent } from '../star-rating/star-rating.component';
import { DeleteConfirmationComponent } from '../delete-confirmation/delete-confirmation.component';
import { AddAmendRoastFormComponent } from '../add-amend-roast-form/add-amend-roast-form.component';

@Component({
  selector: 'app-roast-summary',
  standalone: true,
  imports: [
    MatButtonModule,
    MatCardModule,
    MatChipsModule,
    MatIconModule,
    StarRatingComponent,
  ],
  styleUrl: './roast-summary.component.scss',
  template: `
    <mat-card>
      <mat-card-header>
        <div>
          <mat-card-title>{{ roast.name }}</mat-card-title>
          <mat-card-subtitle>{{ roast.roaster }}</mat-card-subtitle>
        </div>

        <span class="spacer"></span>

        @if (roast.origin) {
          <mat-icon
            class="material-symbols-rounded"
            aria-hidden="false"
            aria-label="Example home icon"
          >
            public
          </mat-icon>
          <p>{{ roast.origin.join(', ') }}</p>
        }
      </mat-card-header>

      <mat-card-content>
        @if (roast.composition && roast.processMethod) {
          <p>{{ [roast.composition, roast.processMethod].join(', ') }}</p>
        } @else if (roast.composition) {
          <p>{{ roast.composition }}</p>
        } @else if (roast.processMethod) {
          <p>{{ roast.processMethod }}</p>
        }

        @if (roast.tastingNotes) {
          <mat-chip-set aria-label="Tasting notes">
            @for (tastingNote of roast.tastingNotes; track tastingNote) {
              <mat-chip>{{ tastingNote }}</mat-chip>
            }
          </mat-chip-set>
        }
      </mat-card-content>

      <mat-card-actions>
        <button
          (click)="openDeleteRoastDialog(roast._id, roast.name)"
          mat-button
          color="warn"
          aria-label="Delete roast"
        >
          <span>Delete</span>
          <mat-icon class="material-symbols-rounded" aria-hidden>
            delete
          </mat-icon>
        </button>

        <button
          (click)="openAmendRoastDialog(roast)"
          mat-icon-button
          aria-label="Amend roast"
        >
          <mat-icon class="material-symbols-rounded" aria-hidden>
            edit
          </mat-icon>
        </button>

        <span class="spacer"></span>

        @if (roast.rating) {
          <app-star-rating
            [rating]="roast.rating"
            [readonly]="true"
          ></app-star-rating>
        }
      </mat-card-actions>
    </mat-card>
  `,
})
export class RoastSummaryComponent {
  constructor(public dialog: MatDialog) {}

  @Input() roast!: Roast;

  openAmendRoastDialog(roast: Roast): void {
    this.dialog.open(AddAmendRoastFormComponent, { data: roast });
  }

  openDeleteRoastDialog(id: string, name: string): void {
    this.dialog.open(DeleteConfirmationComponent, {
      data: { roastId: id, roastName: name },
    });
  }
}
