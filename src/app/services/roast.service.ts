import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';

import { Roast, NewRoast } from '../types/roast.type';

@Injectable({
  providedIn: 'root',
})
export class RoastService {
  private http = inject(HttpClient);

  roastsSignal = signal<Roast[]>([]);

  createRoast(newRoast: NewRoast): Promise<void> {
    return new Promise((resolve, reject) => {
      this.http.post<Roast>('/api/v1/roasts', newRoast).subscribe({
        next: (newRoastObject) => {
          this.roastsSignal.update((currentRoasts) => [
            ...currentRoasts,
            newRoastObject,
          ]);
          resolve();
        },
        error: (err) => {
          console.log(err);
          reject();
        },
      });
    });
  }

  getUsersRoasts(): void {
    this.http
      .get<Roast[]>('/api/v1/roasts')
      .subscribe((roasts) => this.roastsSignal.set(roasts));
  }

  updateRoast(roastId: string, updates: Partial<NewRoast>): Promise<void> {
    return new Promise((resolve, reject) => {
      this.http.patch<Roast>(`/api/v1/roasts/${roastId}`, updates).subscribe({
        next: (updatedRoastObject) => {
          this.roastsSignal.update((currentRoasts) => {
            const indexOfUpdated = currentRoasts.findIndex(
              (roast) => roast._id === updatedRoastObject._id
            );
            currentRoasts[indexOfUpdated] = updatedRoastObject;
            return currentRoasts;
          });
          resolve();
        },
        error: (err) => {
          console.log(err);
          reject();
        },
      });
    });
  }

  deleteRoast(id: string): void {
    this.http
      .delete(`/api/v1/roasts/${id}`)
      .subscribe(() =>
        this.roastsSignal.update((currentRoasts) =>
          currentRoasts.filter((roast) => roast._id !== id)
        )
      );
  }
}
