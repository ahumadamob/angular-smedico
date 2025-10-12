export interface Asistente {
  id: number;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  dni: string;
}

export interface AsistenteCreate {
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  dni: string;
}

export interface AsistenteUpdate {
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  dni: string;
}
