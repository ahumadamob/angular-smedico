import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { ApiHttpService } from './api-http.service';
import { ObraSocialService } from './obra-social.service';
import { ObraSocial } from '../../shared/models';
import { provideEnvironmentServiceMock } from '../testing/environment.service.mock';

describe('ObraSocialService', () => {
  let service: ObraSocialService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ApiHttpService, ObraSocialService, provideEnvironmentServiceMock()]
    });

    service = TestBed.inject(ObraSocialService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('lists obras sociales', () => {
    const mockData: ObraSocial[] = [
      { id: 1, nombre: 'Plan Salud', telefono: '+5491100000000', direccion: 'Calle 123', cobertura: 'Integral' }
    ];

    service.list().subscribe((response) => {
      expect(response).toEqual(mockData);
    });

    const request = httpMock.expectOne('https://api.test.local/obrasocial');
    expect(request.request.method).toBe('GET');
    request.flush({ success: true, data: mockData });
  });
});
