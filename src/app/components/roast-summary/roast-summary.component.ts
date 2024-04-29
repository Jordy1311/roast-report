import { Component, Input, inject } from '@angular/core';

import { Roast } from '../../types/roast.type';
import { RoastService } from '../../services/roast.service';

@Component({
  selector: 'app-roast-summary',
  standalone: true,
  imports: [],
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
        class="mt-3 button is-text is-small is-outlined"
        [class.is-danger]=""
        aria-label="Delete coffee"
        >
        <span class="icon is-small">
          <i class="fa-regular fa-trash-can"></i>
        </span>
        <span>Delete</span>
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
