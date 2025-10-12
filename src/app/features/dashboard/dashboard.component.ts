import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnInit, computed, inject, signal } from '@angular/core';
import { forkJoin, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { AsistenteService } from '../../core/services/asistente.service';
import { DireccionPacienteService } from '../../core/services/direccion-paciente.service';
import { HistorialPacienteService } from '../../core/services/historial-paciente.service';
import { PacienteService } from '../../core/services/paciente.service';

interface DashboardCard {
  title: string;
  description: string;
  hint: string;
}

@Component({
  standalone: true,
  selector: 'app-dashboard',
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DashboardComponent implements OnInit {
  private readonly pacienteService = inject(PacienteService);
  private readonly direccionService = inject(DireccionPacienteService);
  private readonly historialService = inject(HistorialPacienteService);
  private readonly asistenteService = inject(AsistenteService);

  readonly loading = signal(true);
  readonly cards = signal<DashboardCard[]>([]);
  readonly hasCards = computed(() => this.cards().length > 0);

  ngOnInit(): void {
    this.loadMetrics();
  }

  trackByTitle(_: number, card: DashboardCard): string {
    return card.title;
  }

  refresh(): void {
    this.loadMetrics();
  }

  private loadMetrics(): void {
    this.loading.set(true);

    forkJoin({
      pacientes: this.pacienteService
        .count()
        .pipe(catchError(() => of(0))),
      direcciones: this.direccionService
        .list()
        .pipe(
          map((items) => items.length),
          catchError(() => of(0))
        ),
      historial: this.historialService
        .list()
        .pipe(
          map((items) => items.length),
          catchError(() => of(0))
        ),
      asistentes: this.asistenteService
        .list()
        .pipe(
          map((items) => items.length),
          catchError(() => of(0))
        )
    }).subscribe(({ pacientes, direcciones, historial, asistentes }) => {
      this.cards.set([
        {
          title: 'Pacientes registrados',
          description: `${pacientes} pacientes activos en el sistema`,
          hint: 'Fuente: /pacientes/cantidad'
        },
        {
          title: 'Direcciones cargadas',
          description: `${direcciones} direcciones verificadas`,
          hint: 'Fuente: /direccion-paciente'
        },
        {
          title: 'Eventos en historiales',
          description: `${historial} eventos clínicos registrados`,
          hint: 'Fuente: /historialpaciente'
        },
        {
          title: 'Asistentes habilitados',
          description: `${asistentes} asistentes listos para operar`,
          hint: 'Fuente: /asistentes'
        },
        {
          title: 'Próxima etapa',
          description: 'Integrar gestión de afiliaciones y consolidar métricas adicionales.',
          hint: 'Etapa 5 – Obra social y afiliaciones'
        }
      ]);
      this.loading.set(false);
    });
  }
}
