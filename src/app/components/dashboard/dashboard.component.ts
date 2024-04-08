import { Component, OnInit } from '@angular/core';
import { NgFor } from '@angular/common';

import { RoastService } from '../../services/roast.service';
import { RoastSummaryComponent } from '../roast-summary/roast-summary.component';
import { Roast } from '../../types/roast.type';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [ NgFor, RoastSummaryComponent ],
  styleUrl: './dashboard.component.css',
  template: `
    <header>
      <h1>Roast Report</h1>
    </header>

    <main>
      <app-roast-summary
        *ngFor="let roast of usersRoasts"
        [roast]="roast"
        >
      </app-roast-summary>
    </main>
  `,
})
export class DashboardComponent implements OnInit {
  usersRoasts: Roast[] = [];

  constructor(private roastService: RoastService) { }

  ngOnInit(): void {
    this.roastService.getUsersRoasts()
      .subscribe((roasts) => this.usersRoasts = roasts);
  }
}
