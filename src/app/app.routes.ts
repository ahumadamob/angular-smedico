import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'dashboard'
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./features/dashboard/dashboard.component').then((m) => m.DashboardComponent)
  },
  {
    path: 'especialidades',
    loadComponent: () =>
      import('./features/especialidades/especialidades.component').then((m) => m.EspecialidadesComponent)
  },
  {
    path: 'estados-turno',
    loadComponent: () =>
      import('./features/estados-turno/estados-turno.component').then((m) => m.EstadosTurnoComponent)
  },
  {
    path: 'medios-pago',
    loadComponent: () =>
      import('./features/medios-pago/medios-pago.component').then((m) => m.MediosPagoComponent)
  },
  {
    path: 'motivos-cancelacion',
    loadComponent: () =>
      import('./features/motivos-cancelacion/motivos-cancelacion.component').then((m) => m.MotivosCancelacionComponent)
  },
  {
    path: 'medicamentos',
    loadComponent: () =>
      import('./features/medicamentos/medicamentos.component').then((m) => m.MedicamentosComponent)
  },
  {
    path: 'consultorios',
    loadComponent: () =>
      import('./features/consultorios/consultorios.component').then((m) => m.ConsultoriosComponent)
  },
  {
    path: 'habitaciones',
    loadComponent: () =>
      import('./features/habitaciones-paciente/habitaciones-paciente.component').then(
        (m) => m.HabitacionesPacienteComponent
      )
  },
  {
    path: 'obras-sociales',
    loadComponent: () =>
      import('./features/obras-sociales/obras-sociales.component').then((m) => m.ObrasSocialesComponent)
  },
  {
    path: '**',
    redirectTo: 'dashboard'
  }
];
