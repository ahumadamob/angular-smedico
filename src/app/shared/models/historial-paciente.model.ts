export interface HistorialPaciente {
  id: number;
  pacienteId: number;
  evento: string;
  fecha: string;
  observacion?: string;
}

export interface HistorialPacienteCreate {
  pacienteId: number;
  evento: string;
  fecha: string;
  observacion?: string;
}

export interface HistorialPacienteUpdate {
  pacienteId: number;
  evento: string;
  fecha: string;
  observacion?: string;
}
