import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

import { ApiHttpService } from './api-http.service';
import { ApiSuccessResponse, MedioPago, MedioPagoCreate, MedioPagoUpdate } from '../../shared/models';

@Injectable({ providedIn: 'root' })
export class MedioPagoService {
  private readonly endpoint = '/mediopago';

  constructor(private readonly http: ApiHttpService) {}

  list(): Observable<MedioPago[]> {
    return this.http
      .get<ApiSuccessResponse<MedioPago[]>>(this.endpoint)
      .pipe(map((response) => response.data ?? []));
  }

  create(payload: MedioPagoCreate): Observable<MedioPago> {
    return this.http
      .post<ApiSuccessResponse<MedioPago>>(this.endpoint, payload)
      .pipe(map((response) => response.data));
  }

  update(id: number, payload: MedioPagoUpdate): Observable<MedioPago> {
    return this.http
      .put<ApiSuccessResponse<MedioPago>>(`${this.endpoint}/${id}`, payload)
      .pipe(map((response) => response.data));
  }

  delete(id: number): Observable<void> {
    return this.http
      .delete<ApiSuccessResponse<unknown>>(`${this.endpoint}/${id}`)
      .pipe(map(() => void 0));
  }
}
