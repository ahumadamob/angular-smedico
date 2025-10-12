export type MedioPagoTipo = 'TARJETA_CREDITO_DEBITO' | 'MERCADO_PAGO' | 'CANJE_CUPON';

export interface MedioPago {
  id: number;
  nombre: string;
  tipo: MedioPagoTipo;
}

export interface MedioPagoCreate {
  nombre: string;
  tipo: MedioPagoTipo;
}

export interface MedioPagoUpdate {
  nombre: string;
  tipo: MedioPagoTipo;
}
