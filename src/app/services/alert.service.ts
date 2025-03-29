import { inject, Injectable } from '@angular/core';

import {
  MatSnackBarConfig,
  MatSnackBar,
  MatSnackBarRef,
  TextOnlySnackBar,
} from '@angular/material/snack-bar';

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
  ): MatSnackBarRef<TextOnlySnackBar> {
    return this.snackbar.open(
      message, dismissText, this.SnackBarOptions
    );
  }

  public showWithActionRefresh(
    message: string,
    dismissText: string
  ): MatSnackBarRef<TextOnlySnackBar> {
    const snackbarRef = this.snackbar.open(
      message, dismissText, this.SnackBarOptions
    );

    snackbarRef.onAction().subscribe(() => {
      location.reload();
    });

    return snackbarRef;
  }
}
