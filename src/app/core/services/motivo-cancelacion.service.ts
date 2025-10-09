import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

import { ApiHttpService } from './api-http.service';
import {
  ApiSuccessResponse,
  MotivoCancelacion,
  MotivoCancelacionCreate,
  MotivoCancelacionUpdate
} from '../../shared/models';

@Injectable({ providedIn: 'root' })
export class MotivoCancelacionService {
  private readonly endpoint = '/motivocancelacion';

  constructor(private readonly http: ApiHttpService) {}

  list(): Observable<MotivoCancelacion[]> {
    return this.http
      .get<ApiSuccessResponse<MotivoCancelacion[]>>(this.endpoint)
      .pipe(map((response) => response.data ?? []));
  }

  create(payload: MotivoCancelacionCreate): Observable<MotivoCancelacion> {
    return this.http
      .post<ApiSuccessResponse<MotivoCancelacion>>(this.endpoint, payload)
      .pipe(map((response) => response.data));
  }

  update(id: number, payload: MotivoCancelacionUpdate): Observable<MotivoCancelacion> {
    return this.http
      .put<ApiSuccessResponse<MotivoCancelacion>>(`${this.endpoint}/${id}`, payload)
      .pipe(map((response) => response.data));
  }

  delete(id: number): Observable<void> {
    return this.http
      .delete<ApiSuccessResponse<unknown>>(`${this.endpoint}/${id}`)
      .pipe(map(() => void 0));
  }
}
