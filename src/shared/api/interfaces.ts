/* ----------------- error tipado ----------------- */
export class HttpError<T = any> extends Error {
  status?: number;
  data?: T;
  constructor(message: string, status?: number, data?: T) {
    super(message);
    this.status = status;
    this.data = data;
  }
}
export const isHttpError = (e: unknown): e is HttpError<any> =>
  e instanceof Error && "status" in (e as any);

/* ----------------- http genérico ----------------- */
export type HttpOpts = {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  data?: any;
  params?: Record<string, any>;
  headers?: Record<string, string>;
  responseType?: "json" | "blob" | "text";
};

export interface ShipmentListItem {
  id: number;
  guia: string;
  tipo_paquete: string;
  peso_kg: number;
  largo_cm: number;
  ancho_cm: number;
  alto_cm: number;
  destino_ciudad?: string;
  fecha_creacion: string;
}

export type CreateShipmentDTO = {
  guia: string;
  peso_kg: number;
  largo_cm: number;
  ancho_cm: number;
  alto_cm: number;
  tipo_paquete: string;
  descripcion_producto?: string | null;
  id_direccion_destino: number;
  creado_por: string;
};

export type generarCheckpoint = {
  guia: string;
  peso_kg: number;
  largo_cm: number;
  ancho_cm: number;
  alto_cm: number;
  tipo_paquete: string;
  descripcion_producto?: string | null;
  id_direccion_destino: number;
  creado_por: string;
};
export type EstadoCheckpoint =
  | "sin_asignar"
  | "asignado"
  | "transporte"
  | "entregado";
export interface IAsignacionGuia {
  guia: string;
  estado: EstadoCheckpoint; // puedes ampliar según tus estados
  fecha: string; // ISO 8601 (ej. "2025-09-17T12:30:00Z")
  usuario_id: string; // UUID
  equipo_transporte?: string; // puede ser id numérico como string
}

export interface GuideCheckpointHistory {
  guia: string;
  estado_actual: string;
  equipo_transporte: number | null;
  fecha_ultimo_cambio: string;
  historico: {
    estado: string;
    fecha: string; // ISO
    creado_por: string;
    actualizado_por: string;
    equipo_transporte: number | null;
  }[];
}
