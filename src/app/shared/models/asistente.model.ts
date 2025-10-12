export interface Asistente {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  dni: number;
}

export interface AsistenteCreate {
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  dni: number;
}

export interface AsistenteUpdate {
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  dni: number;
}
