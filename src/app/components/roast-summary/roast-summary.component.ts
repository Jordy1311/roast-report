import { Component, Input } from '@angular/core';
import { NgIf } from '@angular/common';

import { Roast } from '../../types/roast.type';

@Component({
  selector: 'app-roast-summary',
  standalone: true,
  imports: [ NgIf ],
  styleUrl: './roast-summary.component.css',
  template: `
    <hgroup class="roast-hgroup">
      <h3>{{ roast.name }}</h3>
      <div class="sub-header">
        <p>{{ roast.roaster }}</p>
        <p>{{ roast.origin }}</p>
      </div>
    </hgroup>

    <p>
      <small *ngIf="roast.composition || roast.processMethod">
        {{ [roast.composition, roast.processMethod].join(', ') }}
        <br />
      </small>
      <small>
        Tastes like {{ roast.tastingNotes?.join(', ') }}
        <br />
      </small>
      <small>
        Roasted for {{ roast.roastedFor?.join(', ') }}
        <br />
      </small>
    </p>
  `,
})
export class RoastSummaryComponent {
  @Input() roast!: Roast;
}
