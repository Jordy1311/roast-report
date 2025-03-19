import { Component, EventEmitter, Input, Output } from '@angular/core';
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
      <mat-label>Search</mat-label>
      <mat-icon matPrefix>search</mat-icon>

      <input
        matInput
        type="text"
        [(ngModel)]="value"
        (ngModelChange)="newValue.emit(value)"
        (keydown.escape)="newValue.emit('')"
      />

      @if (value) {
        <button
          matSuffix
          mat-icon-button
          aria-label="Clear"
          (click)="newValue.emit('')"
        >
          <mat-icon>close</mat-icon>
        </button>
      }
    </mat-form-field>
  `,
})
export class RoastSearchComponent {
  @Input() value: string = '';
  @Output() newValue = new EventEmitter<string>();
}
