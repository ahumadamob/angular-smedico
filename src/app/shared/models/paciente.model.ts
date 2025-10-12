export interface Paciente {
  id: number;
  nombre: string;
  apellido: string;
  dni: string;
  email: string;
  fechaNacimiento?: string;
  telefono: string;
}

export interface PacienteCreate {
  nombre: string;
  apellido: string;
  dni: string;
  email: string;
  fechaNacimiento?: string;
  telefono: string;
}

export interface PacienteUpdate {
  nombre: string;
  apellido: string;
  dni: string;
  email: string;
  fechaNacimiento?: string;
  telefono: string;
}
