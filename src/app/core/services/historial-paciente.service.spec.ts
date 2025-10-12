import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { ApiHttpService } from './api-http.service';
import { HistorialPacienteService } from './historial-paciente.service';
import { HistorialPaciente } from '../../shared/models';
import { provideEnvironmentServiceMock } from '../testing/environment.service.mock';

describe('HistorialPacienteService', () => {
  let service: HistorialPacienteService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ApiHttpService, HistorialPacienteService, provideEnvironmentServiceMock()]
    });

    service = TestBed.inject(HistorialPacienteService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('lists historial entries', () => {
    const mockData: HistorialPaciente[] = [
      { id: 1, pacienteId: 5, evento: 'Ingreso', fecha: '2024-01-01', observacion: 'Observación inicial' }
    ];

    service.list().subscribe((response) => {
      expect(response).toEqual(mockData);
    });

    const request = httpMock.expectOne('https://api.test.local/historialpaciente');
    expect(request.request.method).toBe('GET');
    request.flush({ success: true, data: mockData });
  });
});
