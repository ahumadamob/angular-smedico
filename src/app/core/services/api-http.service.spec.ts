import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { ApiHttpService } from './api-http.service';
import { EnvironmentService } from './environment.service';

class EnvironmentServiceStub {
  apiBaseUrl = 'https://api.example.test';
  production = false;

  get environmentLabel(): string {
    return 'Test';
  }
}

describe('ApiHttpService', () => {
  let service: ApiHttpService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ApiHttpService,
        { provide: EnvironmentService, useClass: EnvironmentServiceStub }
      ]
    });

    service = TestBed.inject(ApiHttpService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('prefixes the base URL for relative endpoints', () => {
    service.get('/patients').subscribe();

    const request = httpMock.expectOne('https://api.example.test/patients');
    expect(request.request.method).toBe('GET');
    request.flush({});
  });

  it('leaves absolute URLs unchanged', () => {
    service.get('https://external.example.com/data').subscribe();

    const request = httpMock.expectOne('https://external.example.com/data');
    expect(request.request.method).toBe('GET');
    request.flush({});
  });

  it('throws when endpoint is empty', () => {
    expect(() => service.get('')).toThrowError('Endpoint must be a non-empty string');
  });
});
