interface propsHistorial {
  idtatenciones_al_cliente?: number;
  fk_consultorio: number;
  fk_tipo_atencion: number;
  fk_usuarios: number;
  fk_software: number;
  fk_hardware: number;
  fk_usuario_atiende: number;
  fk_estado_atencion: number;
  atclie_fecha: string;
  atclie_descripcion: any;
  atcliente_duracion: number | null;
  atendido_por?: string;
}

interface propsHistorialVista {
  idtatenciones_al_cliente: number;
  fk_consultorio: number;
  fk_tipo_atencion: number;
  fk_usuarios: number;
  atclie_fecha: string;
  atclie_descripcion: string;
  atcliente_duracion: string;
  fk_software: number;
  fk_hardware: number;
  fk_estado_atencion: number;
  consul_denominacion_cop: string;
  tipo_at_descr: string;
  estatt_descripcion: any;
  atendido_por: string;
}

interface ApiResponse<T> {
  error: boolean;
  status: number;
  body: T;
  message?: string;
}

interface PaginacionResponse<T> {
  data: T;
  totalRegistros: number;
  totalPaginas: number;
  nro_de_pagina: string;
  tamanio_pagina: string;
}

interface ApiResponseVista<T> {
  error: boolean;
  status: number;
  body: PaginacionResponse<T>;
  message?: string;
}

// Software
interface TipoSoftware {
  idttsoftware_footx: number;
  softfx_descr: string;
}

// Tipo de atención
interface TipoAtencion {
  idttipo_de_atencion: number;
  tipo_at_descr: string;
}

// Hardware
interface TipoHardware {
  idtthardware_footx: number;
  hardfx_descr: string;
}

// Estado atención
interface EstadoAtencion {
  idtestados_atenciones: number;
  estatt_descripcion: string;
}

interface Consultorios {
  idtconsultorios: number;
  consul_denominacion_cop: string;
}

export type {
  propsHistorial,
  propsHistorialVista,
  ApiResponse,
  ApiResponseVista,
  TipoSoftware,
  TipoAtencion,
  TipoHardware,
  EstadoAtencion,
  Consultorios,
};
