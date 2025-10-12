import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

import { ApiHttpService } from './api-http.service';
import {
  ApiSuccessResponse,
  HistorialPaciente,
  HistorialPacienteCreate,
  HistorialPacienteUpdate
} from '../../shared/models';

@Injectable({ providedIn: 'root' })
export class HistorialPacienteService {
  private readonly endpoint = '/historialpaciente';

  constructor(private readonly http: ApiHttpService) {}

  list(): Observable<HistorialPaciente[]> {
    return this.http
      .get<ApiSuccessResponse<HistorialPaciente[]>>(this.endpoint)
      .pipe(map((response) => response.data ?? []));
  }

  create(payload: HistorialPacienteCreate): Observable<HistorialPaciente> {
    return this.http
      .post<ApiSuccessResponse<HistorialPaciente>>(this.endpoint, payload)
      .pipe(map((response) => response.data));
  }

  update(id: number, payload: HistorialPacienteUpdate): Observable<HistorialPaciente> {
    return this.http
      .put<ApiSuccessResponse<HistorialPaciente>>(`${this.endpoint}/${id}`, payload)
      .pipe(map((response) => response.data));
  }

  delete(id: number): Observable<void> {
    return this.http
      .delete<ApiSuccessResponse<unknown>>(`${this.endpoint}/${id}`)
      .pipe(map(() => void 0));
  }
}
