import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { ApiHttpService } from './api-http.service';
import { PacienteService } from './paciente.service';
import { Paciente } from '../../shared/models';
import { provideEnvironmentServiceMock } from '../testing/environment.service.mock';

describe('PacienteService', () => {
  let service: PacienteService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ApiHttpService, PacienteService, provideEnvironmentServiceMock()]
    });

    service = TestBed.inject(PacienteService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('lists pacientes', () => {
    const mockData: Paciente[] = [
      {
        id: 1,
        nombre: 'Ana',
        apellido: 'García',
        dni: '12345678',
        email: 'ana@example.com',
        telefono: '+5491100000000'
      }
    ];

    service.list().subscribe((response) => {
      expect(response).toEqual(mockData);
    });

    const request = httpMock.expectOne('https://api.test.local/pacientes');
    expect(request.request.method).toBe('GET');
    request.flush({ success: true, data: mockData });
  });

  it('counts pacientes', () => {
    service.count().subscribe((response) => {
      expect(response).toBe(12);
    });

    const request = httpMock.expectOne('https://api.test.local/pacientes/cantidad');
    expect(request.request.method).toBe('GET');
    request.flush({ success: true, data: 12 });
  });
});
