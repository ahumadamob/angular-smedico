export interface ApiSuccessResponse<T> {
  success: true;
  message?: string;
  data: T;
  timestamp?: string;
}

export interface ApiErrorField {
  field: string;
  message: string;
}

export interface ApiErrorResponse {
  success: false;
  message?: string;
  errors?: ApiErrorField[];
  timestamp?: string;
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;

export interface PaginatedResponse<T> {
  items: readonly T[];
  total: number;
  page?: number;
  pageSize?: number;
}

export interface Identifiable<ID = number> {
  id: ID;
}

export * from './consultorio.model';
export * from './especialidad.model';
export * from './estado-turno.model';
export * from './habitacion-paciente.model';
export * from './medio-pago.model';
export * from './medicamento.model';
export * from './motivo-cancelacion.model';
export * from './obra-social.model';
