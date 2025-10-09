import { Provider } from '@angular/core';

import { EnvironmentService } from '../services/environment.service';

export class EnvironmentServiceMock {
  apiBaseUrl = 'https://api.test.local';
  production = false;
  private label = 'Pruebas';

  get environmentLabel(): string {
    return this.label;
  }

  set environmentLabel(value: string) {
    this.label = value;
  }
}

export function provideEnvironmentServiceMock(
  overrides: Partial<EnvironmentServiceMock> = {}
): Provider {
  const mock = new EnvironmentServiceMock();
  Object.assign(mock, overrides);

  return {
    provide: EnvironmentService,
    useValue: mock
  };
}
