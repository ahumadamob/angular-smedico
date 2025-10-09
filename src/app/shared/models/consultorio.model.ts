export interface Consultorio {
  id: number;
  nombre: string;
  ubicacion: string;
  piso: number;
}

export interface ConsultorioCreate {
  nombre: string;
  ubicacion: string;
  piso: number;
}

export interface ConsultorioUpdate {
  nombre: string;
  ubicacion: string;
  piso: number;
}
