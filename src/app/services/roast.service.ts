import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';

import { Roast } from '../types/roast.type';

@Injectable({
  providedIn: 'root'
})
export class RoastService {
  private http = inject(HttpClient);

  getUsersRoasts(): Observable<Roast[]> {
    return this.http.get<Roast[]>('/api/v1/roasts');
  }
}
