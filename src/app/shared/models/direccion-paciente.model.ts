export interface DireccionPaciente {
  id: number;
  calle?: string;
  numero?: number;
  localidad?: string;
  provincia?: string;
  ccpp?: string;
}

export interface DireccionPacienteCreate {
  calle?: string;
  numero?: number;
  localidad?: string;
  provincia?: string;
  ccpp?: string;
}

export interface DireccionPacienteUpdate {
  calle?: string;
  numero?: number;
  localidad?: string;
  provincia?: string;
  ccpp?: string;
}
