import { Injectable } from '@angular/core';

import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class EnvironmentService {
  readonly apiBaseUrl = environment.apiBaseUrl;
  readonly production = environment.production;

  get environmentLabel(): string {
    if (environment.environmentLabel) {
      return environment.environmentLabel;
    }

    return this.production ? 'Producción' : 'Desarrollo';
  }
}
