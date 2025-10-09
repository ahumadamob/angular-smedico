import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

import { ApiHttpService } from './api-http.service';
import { ApiSuccessResponse, Consultorio, ConsultorioCreate, ConsultorioUpdate } from '../../shared/models';

@Injectable({ providedIn: 'root' })
export class ConsultorioService {
  private readonly endpoint = '/consultorio';

  constructor(private readonly http: ApiHttpService) {}

  list(): Observable<Consultorio[]> {
    return this.http
      .get<ApiSuccessResponse<Consultorio[]>>(this.endpoint)
      .pipe(map((response) => response.data ?? []));
  }

  create(payload: ConsultorioCreate): Observable<Consultorio> {
    return this.http
      .post<ApiSuccessResponse<Consultorio>>(this.endpoint, payload)
      .pipe(map((response) => response.data));
  }

  update(id: number, payload: ConsultorioUpdate): Observable<Consultorio> {
    return this.http
      .put<ApiSuccessResponse<Consultorio>>(`${this.endpoint}/${id}`, payload)
      .pipe(map((response) => response.data));
  }

  delete(id: number): Observable<void> {
    return this.http
      .delete<ApiSuccessResponse<unknown>>(`${this.endpoint}/${id}`)
      .pipe(map(() => void 0));
  }
}
