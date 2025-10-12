import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

import { ApiHttpService } from './api-http.service';
import {
  ApiSuccessResponse,
  HabitacionPaciente,
  HabitacionPacienteCreate,
  HabitacionPacienteUpdate
} from '../../shared/models';

@Injectable({ providedIn: 'root' })
export class HabitacionPacienteService {
  private readonly endpoint = '/habitaciones';

  constructor(private readonly http: ApiHttpService) {}

  list(): Observable<HabitacionPaciente[]> {
    return this.http
      .get<ApiSuccessResponse<HabitacionPaciente[]>>(this.endpoint)
      .pipe(map((response) => response.data ?? []));
  }

  create(payload: HabitacionPacienteCreate): Observable<HabitacionPaciente> {
    return this.http
      .post<ApiSuccessResponse<HabitacionPaciente>>(this.endpoint, payload)
      .pipe(map((response) => response.data));
  }

  update(id: number, payload: HabitacionPacienteUpdate): Observable<HabitacionPaciente> {
    return this.http
      .put<ApiSuccessResponse<HabitacionPaciente>>(`${this.endpoint}/${id}`, payload)
      .pipe(map((response) => response.data));
  }

  delete(id: number): Observable<void> {
    return this.http
      .delete<ApiSuccessResponse<unknown>>(`${this.endpoint}/${id}`)
      .pipe(map(() => void 0));
  }
}
