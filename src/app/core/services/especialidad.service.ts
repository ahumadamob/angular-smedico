import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

import { ApiHttpService } from './api-http.service';
import { ApiSuccessResponse, Especialidad, EspecialidadCreate, EspecialidadUpdate } from '../../shared/models';

@Injectable({ providedIn: 'root' })
export class EspecialidadService {
  private readonly endpoint = '/especialidad';

  constructor(private readonly http: ApiHttpService) {}

  list(): Observable<Especialidad[]> {
    return this.http
      .get<ApiSuccessResponse<Especialidad[]>>(this.endpoint)
      .pipe(map((response) => response.data ?? []));
  }

  create(payload: EspecialidadCreate): Observable<Especialidad> {
    return this.http
      .post<ApiSuccessResponse<Especialidad>>(this.endpoint, payload)
      .pipe(map((response) => response.data));
  }

  update(id: number, payload: EspecialidadUpdate): Observable<Especialidad> {
    return this.http
      .put<ApiSuccessResponse<Especialidad>>(`${this.endpoint}/${id}`, payload)
      .pipe(map((response) => response.data));
  }

  delete(id: number): Observable<void> {
    return this.http
      .delete<ApiSuccessResponse<unknown>>(`${this.endpoint}/${id}`)
      .pipe(map(() => void 0));
  }
}
