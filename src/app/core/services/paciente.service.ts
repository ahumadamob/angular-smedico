import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

import { ApiHttpService } from './api-http.service';
import {
  ApiSuccessResponse,
  Paciente,
  PacienteCreate,
  PacienteUpdate
} from '../../shared/models';

@Injectable({ providedIn: 'root' })
export class PacienteService {
  private readonly endpoint = '/pacientes';

  constructor(private readonly http: ApiHttpService) {}

  list(): Observable<Paciente[]> {
    return this.http
      .get<ApiSuccessResponse<Paciente[]>>(`${this.endpoint}`)
      .pipe(map((response) => response.data ?? []));
  }

  create(payload: PacienteCreate): Observable<Paciente> {
    return this.http
      .post<ApiSuccessResponse<Paciente>>(this.endpoint, payload)
      .pipe(map((response) => response.data));
  }

  update(id: number, payload: PacienteUpdate): Observable<Paciente> {
    return this.http
      .put<ApiSuccessResponse<Paciente>>(`${this.endpoint}/${id}`, payload)
      .pipe(map((response) => response.data));
  }

  delete(id: number): Observable<void> {
    return this.http
      .delete<ApiSuccessResponse<unknown>>(`${this.endpoint}/${id}`)
      .pipe(map(() => void 0));
  }

  count(): Observable<number> {
    return this.http
      .get<ApiSuccessResponse<number>>(`${this.endpoint}/cantidad`)
      .pipe(map((response) => response.data ?? 0));
  }
}
