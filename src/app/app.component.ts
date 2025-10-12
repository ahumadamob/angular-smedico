import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

import { EnvironmentService } from './core/services/environment.service';

interface NavigationLink {
  label: string;
  route: string;
  exact?: boolean;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  private readonly environmentService = inject(EnvironmentService);

  readonly environmentLabel = computed(() => this.environmentService.environmentLabel);
  readonly navigationLinks = signal<NavigationLink[]>([
    { label: 'Dashboard', route: '/dashboard', exact: true },
    { label: 'Pacientes', route: '/pacientes' },
    { label: 'Direcciones de pacientes', route: '/direcciones-paciente' },
    { label: 'Historial de pacientes', route: '/historial-pacientes' },
    { label: 'Asistentes', route: '/asistentes' },
    { label: 'Especialidades', route: '/especialidades' },
    { label: 'Estados de turno', route: '/estados-turno' },
    { label: 'Medios de pago', route: '/medios-pago' },
    { label: 'Motivos de cancelación', route: '/motivos-cancelacion' },
    { label: 'Medicamentos', route: '/medicamentos' },
    { label: 'Consultorios', route: '/consultorios' },
    { label: 'Habitaciones', route: '/habitaciones' },
    { label: 'Obras sociales', route: '/obras-sociales' }
  ]);
  readonly currentYear = new Date().getFullYear();

  trackByRoute(_: number, link: NavigationLink): string {
    return link.route;
  }
}
