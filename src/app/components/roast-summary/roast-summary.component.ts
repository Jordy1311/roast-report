import { Component, Input, inject } from '@angular/core';

import { Roast } from '../../types/roast.type';
import { RoastService } from '../../services/roast.service';

@Component({
  selector: 'app-roast-summary',
  standalone: true,
  imports: [],
  styleUrl: './roast-summary.component.css',
  template: `
    <article class="card">
      <header>
        <span>{{ roast.name }}</span>
        <span>{{ roast.roaster }}</span>
      </header>

      @if (roast.composition || roast.processMethod) {
        <small>{{ [roast.composition, roast.processMethod].join(', ') }}<br></small>
      }
      @if (roast.tastingNotes) {
        <small>Tastes like: {{ roast.tastingNotes!.join(', ') }}<br></small>
      }
      @if (roast.roastedFor) {
        <small>Roasted for: {{ roast.roastedFor!.join(', ') }}</small>
      }
      <button (click)="deleteRoast(roast._id)" class="outline">
        <i class="fa-regular fa-trash-can"></i>
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
