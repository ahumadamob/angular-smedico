import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { EnvironmentService } from './environment.service';

type HttpOptions = {
  headers?: HttpHeaders | { [header: string]: string | string[] };
  params?: HttpParams | { [param: string]: string | number | boolean | readonly (string | number | boolean)[] };
  reportProgress?: boolean;
  responseType?: 'json';
  withCredentials?: boolean;
};

@Injectable({ providedIn: 'root' })
export class ApiHttpService {
  constructor(private readonly http: HttpClient, private readonly environment: EnvironmentService) {}

  get<T>(endpoint: string, options?: HttpOptions): Observable<T> {
    return this.http.get<T>(this.resolveUrl(endpoint), options);
  }

  post<T>(endpoint: string, body: unknown, options?: HttpOptions): Observable<T> {
    return this.http.post<T>(this.resolveUrl(endpoint), body, options);
  }

  put<T>(endpoint: string, body: unknown, options?: HttpOptions): Observable<T> {
    return this.http.put<T>(this.resolveUrl(endpoint), body, options);
  }

  patch<T>(endpoint: string, body: unknown, options?: HttpOptions): Observable<T> {
    return this.http.patch<T>(this.resolveUrl(endpoint), body, options);
  }

  delete<T>(endpoint: string, options?: HttpOptions): Observable<T> {
    return this.http.delete<T>(this.resolveUrl(endpoint), options);
  }

  private resolveUrl(endpoint: string): string {
    if (!endpoint) {
      throw new Error('Endpoint must be a non-empty string');
    }

    if (/^https?:\/\//i.test(endpoint)) {
      return endpoint;
    }

    const normalizedBase = this.environment.apiBaseUrl.replace(/\/$/, '');
    const normalizedPath = endpoint.replace(/^\/+/, '');

    return `${normalizedBase}/${normalizedPath}`;
  }
}
