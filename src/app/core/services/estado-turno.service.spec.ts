import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { ApiHttpService } from './api-http.service';
import { EstadoTurnoService } from './estado-turno.service';
import { EstadoTurno } from '../../shared/models';
import { provideEnvironmentServiceMock } from '../testing/environment.service.mock';

describe('EstadoTurnoService', () => {
  let service: EstadoTurnoService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ApiHttpService, EstadoTurnoService, provideEnvironmentServiceMock()]
    });

    service = TestBed.inject(EstadoTurnoService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('lists estados de turno', () => {
    const mockData: EstadoTurno[] = [{ id: 1, nombre: 'Pendiente' }];

    service.list().subscribe((response) => {
      expect(response).toEqual(mockData);
    });

    const request = httpMock.expectOne('https://api.test.local/estado-turno');
    expect(request.request.method).toBe('GET');
    request.flush({ success: true, data: mockData });
  });
});
