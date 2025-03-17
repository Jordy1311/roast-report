import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';

import { Roast, NewRoast } from '../types/roast.type';
import { API_URL } from '../variables';

@Injectable({
  providedIn: 'root',
})
export class RoastService {
  private http = inject(HttpClient);

  roastsSignal = signal<Roast[]>([]);

  createRoast(newRoast: NewRoast): Promise<void> {
    return new Promise((resolve, reject) => {
      this.http.post<Roast>(`${API_URL}/v1/roasts`, newRoast).subscribe({
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
      .get<Roast[]>(`${API_URL}/v1/roasts`)
      .subscribe((roasts) => this.roastsSignal.set(roasts));
  }

  updateRoast(roastId: string, updates: Partial<NewRoast>): Promise<void> {
    return new Promise((resolve, reject) => {
      this.http
        .patch<Roast>(`${API_URL}/v1/roasts/${roastId}`, updates)
        .subscribe((updatedRoastObject) => {
          const roasts = this.roastsSignal();
          const indexOfUpdatedRoast = roasts.findIndex(
            (roast) => roast._id === updatedRoastObject._id
          );

          roasts[indexOfUpdatedRoast] = updatedRoastObject;

          this.roastsSignal.set([ ...roasts ]);

          resolve();
        });
    });
  }

  deleteRoast(id: string): void {
    this.http
      .delete(`${API_URL}/v1/roasts/${id}`)
      .subscribe(() =>
        this.roastsSignal.update((currentRoasts) =>
          currentRoasts.filter((roast) => roast._id !== id)
        )
      );
  }
}
