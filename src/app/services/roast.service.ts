import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Roast } from '../types/roast.type';

@Injectable({
  providedIn: 'root'
})
export class RoastService {
  constructor(private http: HttpClient) { }

  getUsersRoasts(): Observable<Roast[]> {
    return this.http.get<Roast[]>('/api/v1/roasts');
  }
}
