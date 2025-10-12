import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { ApiHttpService } from './api-http.service';
import { DireccionPacienteService } from './direccion-paciente.service';
import { DireccionPaciente } from '../../shared/models';
import { provideEnvironmentServiceMock } from '../testing/environment.service.mock';

describe('DireccionPacienteService', () => {
  let service: DireccionPacienteService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ApiHttpService, DireccionPacienteService, provideEnvironmentServiceMock()]
    });

    service = TestBed.inject(DireccionPacienteService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('lists direcciones', () => {
    const mockData: DireccionPaciente[] = [
      { id: 1, calle: 'Primera Junta', numero: 123, localidad: 'CABA', provincia: 'Buenos Aires', ccpp: '1414' }
    ];

    service.list().subscribe((response) => {
      expect(response).toEqual(mockData);
    });

    const request = httpMock.expectOne('https://api.test.local/direccion-paciente');
    expect(request.request.method).toBe('GET');
    request.flush(mockData);
  });
});
