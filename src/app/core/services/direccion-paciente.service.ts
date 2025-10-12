import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

import { ApiHttpService } from './api-http.service';
import { DireccionPaciente, DireccionPacienteCreate, DireccionPacienteUpdate } from '../../shared/models';

@Injectable({ providedIn: 'root' })
export class DireccionPacienteService {
  private readonly endpoint = '/direccion-paciente';

  constructor(private readonly http: ApiHttpService) {}

  list(): Observable<DireccionPaciente[]> {
    return this.http.get<DireccionPaciente[]>(this.endpoint).pipe(map((items) => items ?? []));
  }

  create(payload: DireccionPacienteCreate): Observable<DireccionPaciente> {
    return this.http.post<DireccionPaciente>(this.endpoint, payload);
  }

  update(id: number, payload: DireccionPacienteUpdate): Observable<DireccionPaciente> {
    return this.http.put<DireccionPaciente>(`${this.endpoint}/${id}`, payload);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.endpoint}/${id}`).pipe(map(() => void 0));
  }
}
