export interface Medicamento {
  id: number;
  nombre: string;
  presentacion: string;
  dosisSugerida?: string;
}

export interface MedicamentoCreate {
  nombre: string;
  presentacion: string;
  dosisSugerida?: string;
}

export interface MedicamentoUpdate {
  nombre: string;
  presentacion: string;
  dosisSugerida?: string;
}
