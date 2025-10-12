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
    path: 'pacientes',
    loadComponent: () => import('./features/pacientes/pacientes.component').then((m) => m.PacientesComponent)
  },
  {
    path: 'direcciones-paciente',
    loadComponent: () =>
      import('./features/direcciones-paciente/direcciones-paciente.component').then(
        (m) => m.DireccionesPacienteComponent
      )
  },
  {
    path: 'historial-pacientes',
    loadComponent: () =>
      import('./features/historial-pacientes/historial-pacientes.component').then(
        (m) => m.HistorialPacientesComponent
      )
  },
  {
    path: 'asistentes',
    loadComponent: () => import('./features/asistentes/asistentes.component').then((m) => m.AsistentesComponent)
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
