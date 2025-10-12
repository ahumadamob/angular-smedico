import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { EspecialidadService } from './especialidad.service';
import { Especialidad } from '../../shared/models';
import { ApiHttpService } from './api-http.service';
import { provideEnvironmentServiceMock } from '../testing/environment.service.mock';

describe('EspecialidadService', () => {
  let service: EspecialidadService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ApiHttpService, EspecialidadService, provideEnvironmentServiceMock()]
    });

    service = TestBed.inject(EspecialidadService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('lists especialidades', () => {
    const mockData: Especialidad[] = [
      { id: 1, nombre: 'Cardiología', descripcion: 'Cardio' }
    ];

    service.list().subscribe((response) => {
      expect(response).toEqual(mockData);
    });

    const request = httpMock.expectOne('https://api.test.local/especialidad');
    expect(request.request.method).toBe('GET');
    request.flush({ success: true, data: mockData });
  });
});
