import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { ApiHttpService } from './api-http.service';
import { AsistenteService } from './asistente.service';
import { Asistente } from '../../shared/models';
import { provideEnvironmentServiceMock } from '../testing/environment.service.mock';

describe('AsistenteService', () => {
  let service: AsistenteService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ApiHttpService, AsistenteService, provideEnvironmentServiceMock()]
    });

    service = TestBed.inject(AsistenteService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('lists asistentes', () => {
    const mockData: Asistente[] = [
      {
        id: 3,
        nombre: 'Lucía',
        apellido: 'Fernández',
        email: 'lucia@example.com',
        telefono: '1144444444',
        dni: '33444555'
      }
    ];

    service.list().subscribe((response) => {
      expect(response).toEqual(mockData);
    });

    const request = httpMock.expectOne('https://api.test.local/asistentes');
    expect(request.request.method).toBe('GET');
    request.flush({ success: true, data: mockData });
  });
});
