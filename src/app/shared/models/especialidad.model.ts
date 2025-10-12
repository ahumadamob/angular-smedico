export interface Especialidad {
  id: number;
  nombre: string;
  descripcion: string;
}

export interface EspecialidadCreate {
  nombre: string;
  descripcion: string;
}

export interface EspecialidadUpdate {
  nombre: string;
  descripcion: string;
}
