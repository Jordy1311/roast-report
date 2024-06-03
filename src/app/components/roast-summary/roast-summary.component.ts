import { Component, Input, inject } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { Roast } from '../../types/roast.type';
import { RoastService } from '../../services/roast.service';

@Component({
  selector: 'app-roast-summary',
  standalone: true,
  imports: [ MatButtonModule, MatIconModule ],
  styleUrl: './roast-summary.component.css',
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

      <button
        (click)="deleteRoast(roast._id)"
        mat-button
        color="warn"
        aria-label="Delete coffee"
      >
        <span>Delete</span>
        <mat-icon aria-hidden>delete</mat-icon>
      </button>
    </article>
  `,
})
export class RoastSummaryComponent {
  roastService = inject(RoastService);

  @Input() roast!: Roast;

  deleteRoast(id: string): void {
    this.roastService.deleteRoast(id);
  }
}
