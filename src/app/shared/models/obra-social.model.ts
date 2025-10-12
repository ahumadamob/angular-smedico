export interface ObraSocial {
  id: number;
  nombre: string;
  telefono?: string;
  direccion: string;
  cobertura: string;
}

export interface ObraSocialCreate {
  nombre: string;
  telefono?: string;
  direccion: string;
  cobertura: string;
}

export interface ObraSocialUpdate {
  nombre: string;
  telefono?: string;
  direccion: string;
  cobertura: string;
}
