import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { ApiHttpService } from './api-http.service';
import { MedicamentoService } from './medicamento.service';
import { Medicamento } from '../../shared/models';
import { provideEnvironmentServiceMock } from '../testing/environment.service.mock';

describe('MedicamentoService', () => {
  let service: MedicamentoService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ApiHttpService, MedicamentoService, provideEnvironmentServiceMock()]
    });

    service = TestBed.inject(MedicamentoService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('lists medicamentos', () => {
    const mockData: Medicamento[] = [
      { id: 1, nombre: 'Ibuprofeno', presentacion: '200mg', dosisSugerida: '1 cada 8h' }
    ];

    service.list().subscribe((response) => {
      expect(response).toEqual(mockData);
    });

    const request = httpMock.expectOne('https://api.test.local/medicamento');
    expect(request.request.method).toBe('GET');
    request.flush({ success: true, data: mockData });
  });
});
