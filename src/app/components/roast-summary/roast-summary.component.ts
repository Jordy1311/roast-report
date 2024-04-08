import { Component, Input } from '@angular/core';
import { NgIf } from '@angular/common';

import { Roast } from '../../types/roast.type';

@Component({
  selector: 'app-roast-summary',
  standalone: true,
  imports: [ NgIf ],
  styleUrl: './roast-summary.component.css',
  template: `
    <article class="card">
      <header>
        <span>{{ roast.name }}</span>
        <span>{{ roast.roaster }}</span>
      </header>

      <small *ngIf="roast.composition || roast.processMethod">
        {{ [roast.composition, roast.processMethod].join(', ') }}
        <br>
      </small>
      <small *ngIf="roast.tastingNotes">
        Tastes like: {{ roast.tastingNotes!.join(', ') }}
        <br>
      </small>
      <small *ngIf="roast.roastedFor">
        Roasted for: {{ roast.roastedFor!.join(', ') }}
      </small>
    </article>
  `,
})
export class RoastSummaryComponent {
  @Input() roast!: Roast;
}
