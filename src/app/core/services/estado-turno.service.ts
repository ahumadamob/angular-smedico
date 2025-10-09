import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

import { ApiHttpService } from './api-http.service';
import { ApiSuccessResponse, EstadoTurno, EstadoTurnoCreate, EstadoTurnoUpdate } from '../../shared/models';

@Injectable({ providedIn: 'root' })
export class EstadoTurnoService {
  private readonly endpoint = '/estado-turno';

  constructor(private readonly http: ApiHttpService) {}

  list(): Observable<EstadoTurno[]> {
    return this.http
      .get<ApiSuccessResponse<EstadoTurno[]>>(this.endpoint)
      .pipe(map((response) => response.data ?? []));
  }

  create(payload: EstadoTurnoCreate): Observable<EstadoTurno> {
    return this.http
      .post<ApiSuccessResponse<EstadoTurno>>(this.endpoint, payload)
      .pipe(map((response) => response.data));
  }

  update(id: number, payload: EstadoTurnoUpdate): Observable<EstadoTurno> {
    return this.http
      .put<ApiSuccessResponse<EstadoTurno>>(`${this.endpoint}/${id}`, payload)
      .pipe(map((response) => response.data));
  }

  delete(id: number): Observable<void> {
    return this.http
      .delete<ApiSuccessResponse<unknown>>(`${this.endpoint}/${id}`)
      .pipe(map(() => void 0));
  }
}
