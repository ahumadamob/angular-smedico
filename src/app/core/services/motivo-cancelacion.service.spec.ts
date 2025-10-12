import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { ApiHttpService } from './api-http.service';
import { MotivoCancelacionService } from './motivo-cancelacion.service';
import { MotivoCancelacion } from '../../shared/models';
import { provideEnvironmentServiceMock } from '../testing/environment.service.mock';

describe('MotivoCancelacionService', () => {
  let service: MotivoCancelacionService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ApiHttpService, MotivoCancelacionService, provideEnvironmentServiceMock()]
    });

    service = TestBed.inject(MotivoCancelacionService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('lists motivos de cancelación', () => {
    const mockData: MotivoCancelacion[] = [
      { id: 1, nombre: 'Fuerza mayor', descripcion: 'Motivo' }
    ];

    service.list().subscribe((response) => {
      expect(response).toEqual(mockData);
    });

    const request = httpMock.expectOne('https://api.test.local/motivocancelacion');
    expect(request.request.method).toBe('GET');
    request.flush({ success: true, data: mockData });
  });
});
