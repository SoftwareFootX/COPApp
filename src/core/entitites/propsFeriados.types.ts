interface propsFeriados {
  idtferiados_turnos: number;
  fk_consultorio: number;
  feriado_fecha: string;
  feriado_fijo: any;
  is_deleted: number;
  deleted_by: number;
  created_at: string;
  created_by: number;
  update_at: string;
  update_by: number;
}

interface propsFormFeriados {
  idtferiados_turnos?: number;
  fk_usuarios: number;
  feriado_fecha: string;
  feriado_fijo: number;
}

export type { propsFeriados, propsFormFeriados };
