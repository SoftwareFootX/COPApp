type TotalReporte = {
  atendidos: number;
  inasistencias: number;
  cancelados_sin_reprogramar: number;
};

type DetalleReporte = {
  idt_servicios_consul: number;
  serv_descripcion: string;
  cantidad_atendidos: number;
};

type PropsDataReporte = {
  total: TotalReporte[];
  detalles: DetalleReporte[];
  inasistencias: DetalleReporte[];
};

type propsFeriados = {
  fk_consultorio: number;
  feriado_fecha: string;
};

type propsTurnosSede = {
  pk_sede: number;
  fk_espacios_de_trabajo: number;
  turno_fecha: string;
  turno_hora_ini: string;
  turno_hora_fin: string;
  turno_cancelado: any;
  turno_es_sobreturno: any;
  espt_turnos_completos: number;
};

type propsEspaciosDeTrabajo = {
  idtespacios_de_trabajo: number;
  fk_cede: number;
  espt_turnos_completos: any;
};

type propsTurnosBloqueados = {
  idtturnos_bloqueados: number;
  fk_consultorio: number;
  fk_cede: number;
  turno_bloq_descripcion: string;
  turno_bloq_hora_ini: string;
  turno_bloq_hora_fin: string;
  turno_bloq_tipo: number;
  turno_bloq_fecha: string;
};

export type {
  PropsDataReporte,
  propsFeriados,
  propsTurnosSede,
  propsEspaciosDeTrabajo,
  propsTurnosBloqueados,
};
