import { ChangeDetectionStrategy, Component, OnInit, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

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
  readonly loading = signal(true);
  readonly cards = signal<DashboardCard[]>([]);
  readonly hasCards = computed(() => this.cards().length > 0);

  ngOnInit(): void {
    queueMicrotask(() => {
      this.cards.set([
        {
          title: 'Próximos pasos',
          description: 'Implementa los servicios core, componentes compartidos y el resto de las entidades definidas en el Swagger.',
          hint: 'Etapa 2: Núcleo y compartidos'
        },
        {
          title: 'Estado inicial',
          description: 'Aún no se consultan métricas reales. Integra /system/health o conteos específicos en etapas posteriores.',
          hint: 'Pendiente de datos reales'
        }
      ]);
      this.loading.set(false);
    });
  }

  trackByTitle(_: number, card: DashboardCard): string {
    return card.title;
  }
}
