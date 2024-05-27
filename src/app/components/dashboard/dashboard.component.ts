import { Component, OnInit, inject } from '@angular/core';

import { AuthService } from '../../services/auth.service';
import { RoastService } from '../../services/roast.service';
import { RoastSummaryComponent } from '../roast-summary/roast-summary.component';
import { AddRoastFormComponent } from '../add-roast-form/add-roast-form.component';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [ RoastSummaryComponent, AddRoastFormComponent ],
  styleUrl: './dashboard.component.css',
  template: `
    <header>
      <h1 class="title">Roast Report</h1>
      <div>
        <button
          (click)="logout()"
          class="button is-normal is-link is-outlined"
          aria-label="Add coffee"
        >
          <span>Logout</span>
          <span class="icon">
            <i class="fa-solid fa-right-from-bracket"></i>
          </span>
        </button>
      </div>
    </header>

    <div class="stats mx-auto level is-mobile">
      <div class="level-item has-text-centered">
        <div>
          <p class="heading">Roasts</p>
          <p class="title">{{ usersRoasts().length }}</p>
        </div>
      </div>
      <div class="level-item has-text-centered">
        <div>
          <p class="heading">Roasters</p>
          <p class="title">{{ numberOfUniqueRoasters }}</p>
        </div>
      </div>
    </div>

    <main>
      <div class="roasts">
        @for (roast of usersRoasts(); track roast._id) {
          <app-roast-summary [roast]="roast"></app-roast-summary>
        }
      </div>

      @if (shouldShowAddRoastForm) {
        <app-add-roast-form (formClosed)="toggleAddRoast()"></app-add-roast-form>
      }

      <button
        (click)="toggleAddRoast()"
        class="add-roast button is-link is-medium"
        aria-label="Add coffee"
      >
        <span class="icon">
          <i class="fa-solid fa-plus"></i>
        </span>
        <span>Add</span>
      </button>
    </main>
  `,
})
export class DashboardComponent implements OnInit {
  private authService = inject(AuthService);
  private roastService = inject(RoastService);

  usersRoasts = this.roastService.roastsSignal;
  shouldShowAddRoastForm = false;

  ngOnInit(): void {
    this.roastService.getUsersRoasts();
  }

  get numberOfUniqueRoasters(): number {
    return new Set(
      this.usersRoasts().map((roast) => roast.roaster)
    ).size;
  }

  logout(): void {
    this.authService.logout();
  }

  toggleAddRoast(): void {
    this.shouldShowAddRoastForm = !this.shouldShowAddRoastForm;
  }
}
