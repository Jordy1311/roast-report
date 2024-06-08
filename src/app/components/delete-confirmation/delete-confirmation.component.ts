import { Component, Inject, inject } from '@angular/core';

import { MatButtonModule } from '@angular/material/button';
import {
  MatDialogRef,
  MatDialogTitle,
  MatDialogContent,
  MatDialogActions,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';

import { RoastService } from '../../services/roast.service';

@Component({
  selector: 'app-delete-confirmation',
  standalone: true,
  imports: [ MatDialogTitle, MatDialogContent, MatDialogActions, MatButtonModule, MatIconModule ],
  template: `
    <h2 mat-dialog-title>Delete?</h2>

    <mat-dialog-content>
      <p>Are you sure you want to delete "{{ data.roastName }}"?</p>
    </mat-dialog-content>

    <mat-dialog-actions>
      <button
        cdkFocusInitial
        (click)="closeDialog()"
        mat-button
      >
        No
      </button>

      <button
        (click)="deleteRoast(data.roastId)"
        mat-flat-button
        color="warn"
      >
        Delete
        <mat-icon aria-hidden>delete</mat-icon>
      </button>
    </mat-dialog-actions>
  `,
  styleUrl: './delete-confirmation.component.css'
})
export class DeleteConfirmationComponent {
  private roastService = inject(RoastService);

  constructor(
    public dialogRef: MatDialogRef<DeleteConfirmationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { roastId: string, roastName: string },
  ) { }

  closeDialog(): void {
    this.dialogRef.close();
  }

  deleteRoast(id: string): void {
    this.roastService.deleteRoast(id);
    this.dialogRef.close();
  }
}
