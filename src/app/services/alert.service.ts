import { inject, Injectable } from '@angular/core';

import { MatSnackBarConfig, MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class AlertService {
  private snackbar = inject(MatSnackBar);

  readonly SnackBarOptions: MatSnackBarConfig = {
    verticalPosition: 'bottom',
    horizontalPosition: 'center',
  };

  public showOnly(
    message: string,
    dismissText?: string
  ): void {
    this.snackbar.open(
      message, dismissText, this.SnackBarOptions
    );
  }

  public showWithActionRefresh(
    message: string,
    dismissText: string
  ): void {
    const snackbarRef = this.snackbar.open(
      message, dismissText, this.SnackBarOptions
    );

    snackbarRef.onAction().subscribe(() => {
      location.reload();
    });
  }
}
