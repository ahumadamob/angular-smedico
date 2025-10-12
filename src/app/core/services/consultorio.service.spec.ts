import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { ApiHttpService } from './api-http.service';
import { ConsultorioService } from './consultorio.service';
import { Consultorio } from '../../shared/models';
import { provideEnvironmentServiceMock } from '../testing/environment.service.mock';

describe('ConsultorioService', () => {
  let service: ConsultorioService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ApiHttpService, ConsultorioService, provideEnvironmentServiceMock()]
    });

    service = TestBed.inject(ConsultorioService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('lists consultorios', () => {
    const mockData: Consultorio[] = [
      { id: 1, nombre: 'Consultorio 1', ubicacion: 'Ala norte', piso: 1 }
    ];

    service.list().subscribe((response) => {
      expect(response).toEqual(mockData);
    });

    const request = httpMock.expectOne('https://api.test.local/consultorio');
    expect(request.request.method).toBe('GET');
    request.flush({ success: true, data: mockData });
  });
});
