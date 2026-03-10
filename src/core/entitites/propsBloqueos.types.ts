interface propsBloqueos {
  idtturnos_bloqueados: number;
  fk_consultorio: number;
  fk_cede: number;
  fk_espacios_de_trabajo: number;
  fk_turnos_bloq: number;
  is_deleted: number;
  turno_bloq_descripcion: string;
  turno_bloq_hora_ini: string;
  turno_bloq_hora_fin: string;
  turno_bloq_tipo: number;
  turno_bloq_fecha: string;
  idtespacios_turnos_bloqueados: number;
  espt_descripcion: string;
  espt_turnos_completos: number;
}

interface propsFormBloqueos {
  idtturnos_bloqueados?: number;
  fk_sede: number;
  fecha_turno_bloqueo: string;
  turno_bloq_tipo: number;
  fk_usuarios: number;
  turno_bloq_descripcion: string;
}

export type { propsBloqueos, propsFormBloqueos };
