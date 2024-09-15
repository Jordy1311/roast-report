import { Component, EventEmitter, Output } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-roast-search',
  standalone: true,
  imports: [
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
        (change)="emitValue(searchInput.value)"
        (keydown.escape)="clearValue(searchInput)"
      />

      @if (currentValue && currentValue === searchInput.value) {
        <button
          matSuffix
          mat-icon-button
          aria-label="Clear"
          (click)="clearValue(searchInput)"
        >
          <mat-icon>close</mat-icon>
        </button>
      }

      @if (searchInput.value && currentValue !== searchInput.value) {
        <button
          matSuffix
          mat-icon-button
          aria-label="Search"
          (click)="emitValue(searchInput.value)"
        >
          <mat-icon matSuffix>keyboard_return</mat-icon>
        </button>
      }
    </mat-form-field>
  `,
})
export class RoastSearchComponent {
  @Output() newValue = new EventEmitter<string>();

  currentValue: string | undefined = undefined;

  emitValue(newValue: string): void {
    this.currentValue = newValue;

    this.newValue.emit(newValue);
  }

  clearValue(searchInput: HTMLInputElement): void {
    this.currentValue = '';

    searchInput.value = '';
    this.newValue.emit('');
  }
}
