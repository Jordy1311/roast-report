import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';

import { AlertService } from './alert.service';
import { AuthService } from './auth.service';
import { Roast, NewRoast } from '../types/roast.type';
import { API_URL } from '../variables';

@Injectable({
  providedIn: 'root',
})
export class RoastService {
  private http = inject(HttpClient);
  private authService = inject(AuthService);
  private alertService = inject(AlertService);

  public roastsSignal = signal<Roast[]>([]);

  public createRoast(newRoast: NewRoast): Promise<void> {
    return new Promise((resolve, reject) => {
      this.http
        .post<Roast>(`${API_URL}/v1/roasts`, newRoast)
        .subscribe({
          next: (newRoastObject) => {
            this.roastsSignal.update((currentRoasts) => [
              ...currentRoasts,
              newRoastObject,
            ]);

            resolve();
          },
          error: (err) => this.handleAndReject(err, reject),
        });
    });
  }

  public getUsersRoasts(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.http
        .get<Roast[]>(`${API_URL}/v1/roasts`)
        .subscribe({
          next: (roasts) => {
            this.roastsSignal.set(roasts);

            resolve();
          },
          error: (err) => this.handleAndReject(err, reject),
        });
    });
  }

  public updateRoast(
    roastId: string,
    updates: Partial<NewRoast>
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      this.http
        .patch<Roast>(`${API_URL}/v1/roasts/${roastId}`, updates)
        .subscribe({
          next: (updatedRoastObject) => {
            const roasts = this.roastsSignal();
            const indexOfUpdatedRoast = roasts.findIndex(
              (roast) => roast._id === updatedRoastObject._id
            );

            roasts[ indexOfUpdatedRoast ] = updatedRoastObject;

            this.roastsSignal.set([ ...roasts ]);

            resolve();
          },
          error: (err) => this.handleAndReject(err, reject),
        });
    });
  }

  public deleteRoast(id: string): Promise<void> {
    return new Promise((resolve, reject) => {
      this.http
        .delete(`${API_URL}/v1/roasts/${id}`)
        .subscribe({
          next: () => {
            this.roastsSignal.update((currentRoasts) =>
              currentRoasts.filter((roast) => roast._id !== id)
            ),

              resolve();
          },
          error: (err) => this.handleAndReject(err, reject),
        });
    });
  }

  public getDistinctRoasters(): Promise<string[]> {
    return new Promise((resolve, _reject) => {
      this.http
        .get<string[]>(`${API_URL}/v1/roasts/roasters`)
        .subscribe({ next: (distinctRoasters) => resolve(distinctRoasters) });
    });
  }

  private handleAndReject(
    err: HttpErrorResponse,
    reject: any
  ): void {
    console.error(err);

    if (err.status === 401) {
      return this.authService.logout();
    }

    this.alertService.showOnly(
      'Something went wrong, please refresh and try again.'
    );

    reject();
  }
}
