import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';

import { Roast } from '../types/roast.type';

@Injectable({
  providedIn: 'root'
})
export class RoastService {
  private http = inject(HttpClient);

  roastsSignal = signal<Roast[]>([]);

  getUsersRoasts(): void {
    console.log('getUsersRoasts ran');
    this.http.get<Roast[]>('/api/v1/roasts')
      .subscribe((roasts) => this.roastsSignal.set(roasts));
  }

  addRoast(): void {
    this.roastsSignal.update((currentRoasts) => {
      return [...currentRoasts, {
        _id: '12331343',
        name: 'Things',
        roaster: 'Someone',
        userId: '123123123'
      }]
  });
  }
}
