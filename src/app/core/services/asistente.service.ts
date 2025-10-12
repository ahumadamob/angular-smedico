import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

import { ApiHttpService } from './api-http.service';
import { ApiSuccessResponse, Asistente, AsistenteCreate, AsistenteUpdate } from '../../shared/models';

@Injectable({ providedIn: 'root' })
export class AsistenteService {
  private readonly endpoint = '/asistentes';

  constructor(private readonly http: ApiHttpService) {}

  list(): Observable<Asistente[]> {
    return this.http
      .get<ApiSuccessResponse<Asistente[]>>(this.endpoint)
      .pipe(map((response) => response.data ?? []));
  }

  create(payload: AsistenteCreate): Observable<Asistente> {
    return this.http
      .post<ApiSuccessResponse<Asistente>>(this.endpoint, payload)
      .pipe(map((response) => response.data));
  }

  update(id: number, payload: AsistenteUpdate): Observable<Asistente> {
    return this.http
      .put<ApiSuccessResponse<Asistente>>(`${this.endpoint}/${id}`, payload)
      .pipe(map((response) => response.data));
  }

  delete(id: number): Observable<void> {
    return this.http
      .delete<ApiSuccessResponse<unknown>>(`${this.endpoint}/${id}`)
      .pipe(map(() => void 0));
  }
}
