import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { ApiHttpService } from './api-http.service';
import { HabitacionPacienteService } from './habitacion-paciente.service';
import { HabitacionPaciente } from '../../shared/models';
import { provideEnvironmentServiceMock } from '../testing/environment.service.mock';

describe('HabitacionPacienteService', () => {
  let service: HabitacionPacienteService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ApiHttpService, HabitacionPacienteService, provideEnvironmentServiceMock()]
    });

    service = TestBed.inject(HabitacionPacienteService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('lists habitaciones', () => {
    const mockData: HabitacionPaciente[] = [
      { id: 1, numeroHabitacion: 101, piso: 1, sector: 'A', camasDisponibles: 2 }
    ];

    service.list().subscribe((response) => {
      expect(response).toEqual(mockData);
    });

    const request = httpMock.expectOne('https://api.test.local/habitaciones');
    expect(request.request.method).toBe('GET');
    request.flush({ success: true, data: mockData });
  });
});
