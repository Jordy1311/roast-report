import { Component, Input } from '@angular/core';

import { Roast } from '../../types/roast.type';

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
    </article>
  `,
})
export class RoastSummaryComponent {
  @Input() roast!: Roast;
}
