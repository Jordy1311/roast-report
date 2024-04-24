import { Component, OnInit, inject } from '@angular/core';

import { RoastService } from '../../services/roast.service';
import { RoastSummaryComponent } from '../roast-summary/roast-summary.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [ RoastSummaryComponent ],
  styleUrl: './dashboard.component.css',
  template: `
    <header>
      <h1>Roast Report</h1>
    </header>

    <main>
      <div class="roasts">
        @for (roast of usersRoasts(); track roast._id) {
          <app-roast-summary [roast]="roast"></app-roast-summary>
        }
      </div>

      <button (click)="toggleAddRoast()" class="add-roast">Add roast</button>
    </main>
  `,
})
export class DashboardComponent implements OnInit {
  private roastService = inject(RoastService);

  usersRoasts = this.roastService.roastsSignal;

  ngOnInit(): void {
    this.roastService.getUsersRoasts();
  }

  toggleAddRoast(): void {
    this.roastService.addRoast()
  }
}
