import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-roast-search',
  imports: [
    FormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
  ],
  styleUrl: './roast-search.component.scss',
  template: `
    <mat-form-field appearance="outline">
      <mat-label>Search roasts</mat-label>
      <mat-icon matPrefix>search</mat-icon>

      <input
        #searchInput
        matInput
        type="text"
        [(ngModel)]="currentValue"
        (ngModelChange)="emitValue()"
        (keydown.escape)="clearValue()"
      />

      @if (currentValue && currentValue === searchInput.value) {
        <button
          matSuffix
          mat-icon-button
          aria-label="Clear"
          (click)="clearValue()"
        >
          <mat-icon>close</mat-icon>
        </button>
      }
    </mat-form-field>
  `,
})
export class RoastSearchComponent implements OnInit {
  @Output() newValue = new EventEmitter<string>();

  protected currentValue: string | '' = '';

  ngOnInit(): void {
    const storedSearchField = localStorage.getItem('searchField');
    if (storedSearchField) {
      this.currentValue = storedSearchField;
      // false because we have just retreived from localStorage
      this.emitValue(false);
    }
  }

  protected emitValue(saveToLocalStorage = true): void {
    this.newValue.emit(this.currentValue);

    if (saveToLocalStorage) {
      localStorage.setItem('searchField', this.currentValue);
    }
  }

  protected clearValue(): void {
    this.currentValue = '';

    localStorage.removeItem('searchField');

    this.newValue.emit(this.currentValue);
  }
}
