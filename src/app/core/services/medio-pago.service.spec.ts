import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { ApiHttpService } from './api-http.service';
import { MedioPagoService } from './medio-pago.service';
import { MedioPago } from '../../shared/models';
import { provideEnvironmentServiceMock } from '../testing/environment.service.mock';

describe('MedioPagoService', () => {
  let service: MedioPagoService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ApiHttpService, MedioPagoService, provideEnvironmentServiceMock()]
    });

    service = TestBed.inject(MedioPagoService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('lists medios de pago', () => {
    const mockData: MedioPago[] = [{ id: 1, nombre: 'Tarjeta', tipo: 'TARJETA_CREDITO_DEBITO' }];

    service.list().subscribe((response) => {
      expect(response).toEqual(mockData);
    });

    const request = httpMock.expectOne('https://api.test.local/mediopago');
    expect(request.request.method).toBe('GET');
    request.flush({ success: true, data: mockData });
  });
});
