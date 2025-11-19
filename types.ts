
export interface Billboard {
  id: string;
  codigo: string;
  elemento: string; // e.g., Unipolar, Minipolar
  cara: string; // A, B, C
  formato: string; // e.g., 12x5, 8x4
  distrito: string;
  tipo: string; // Digital, Estática
  medida: string; // e.g., 60m2
  ancho: string;
  alto: string;
  audiencia: number; // Daily impressions
  direccionComercial: string;
  direccionLegal: string;
  departamento: string;
  zona: string; // Norte, Sur, Este, Oeste, Centro
  latitud: number;
  longitud: number;
  observacion: string;
}

export interface FilterState {
  codigo: string;
  elemento: string;
  cara: string;
  formato: string;
  distrito: string;
  tipo: string;
  departamento: string;
  zona: string;
  ancho: string;
  alto: string;
}

export const INITIAL_FILTERS: FilterState = {
  codigo: '',
  elemento: '',
  cara: '',
  formato: '',
  distrito: '',
  tipo: '',
  departamento: '',
  zona: '',
  ancho: '',
  alto: '',
};
