import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

import { ApiHttpService } from './api-http.service';
import { ApiSuccessResponse, Medicamento, MedicamentoCreate, MedicamentoUpdate } from '../../shared/models';

@Injectable({ providedIn: 'root' })
export class MedicamentoService {
  private readonly endpoint = '/medicamento';

  constructor(private readonly http: ApiHttpService) {}

  list(): Observable<Medicamento[]> {
    return this.http
      .get<ApiSuccessResponse<Medicamento[]>>(this.endpoint)
      .pipe(map((response) => response.data ?? []));
  }

  create(payload: MedicamentoCreate): Observable<Medicamento> {
    return this.http
      .post<ApiSuccessResponse<Medicamento>>(this.endpoint, payload)
      .pipe(map((response) => response.data));
  }

  update(id: number, payload: MedicamentoUpdate): Observable<Medicamento> {
    return this.http
      .put<ApiSuccessResponse<Medicamento>>(`${this.endpoint}/${id}`, payload)
      .pipe(map((response) => response.data));
  }

  delete(id: number): Observable<void> {
    return this.http
      .delete<ApiSuccessResponse<unknown>>(`${this.endpoint}/${id}`)
      .pipe(map(() => void 0));
  }
}
