import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

import { ApiHttpService } from './api-http.service';
import { ApiSuccessResponse, ObraSocial, ObraSocialCreate, ObraSocialUpdate } from '../../shared/models';

@Injectable({ providedIn: 'root' })
export class ObraSocialService {
  private readonly endpoint = '/obrasocial';

  constructor(private readonly http: ApiHttpService) {}

  list(): Observable<ObraSocial[]> {
    return this.http
      .get<ApiSuccessResponse<ObraSocial[]>>(this.endpoint)
      .pipe(map((response) => response.data ?? []));
  }

  create(payload: ObraSocialCreate): Observable<ObraSocial> {
    return this.http
      .post<ApiSuccessResponse<ObraSocial>>(this.endpoint, payload)
      .pipe(map((response) => response.data));
  }

  update(id: number, payload: ObraSocialUpdate): Observable<ObraSocial> {
    return this.http
      .put<ApiSuccessResponse<ObraSocial>>(`${this.endpoint}/${id}`, payload)
      .pipe(map((response) => response.data));
  }

  delete(id: number): Observable<void> {
    return this.http
      .delete<ApiSuccessResponse<unknown>>(`${this.endpoint}/${id}`)
      .pipe(map(() => void 0));
  }
}
