export interface HabitacionPaciente {
  id: number;
  numeroHabitacion: number;
  piso: number;
  sector: string;
  camasDisponibles: number;
  descripcion?: string;
}

export interface HabitacionPacienteCreate {
  numeroHabitacion: number;
  piso: number;
  sector: string;
  camasDisponibles: number;
  descripcion?: string;
}

export interface HabitacionPacienteUpdate {
  numeroHabitacion: number;
  piso: number;
  sector: string;
  camasDisponibles: number;
  descripcion?: string;
}
