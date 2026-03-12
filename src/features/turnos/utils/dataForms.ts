const formularioBloqueos = {
  idtturnos_bloqueados: 1,
  fk_sede: 7,
  fecha_turno_bloqueo: "",
  turno_bloq_tipo: 1,
  turno_bloq_hora_ini: "00:00:00",
  turno_bloq_hora_fin: "00:00:00",
  fk_usuarios: 1,
  turno_bloq_descripcion: "",
};

const formulariosFeriados = {
  idtferiados_turnos: 1,
  fk_usuarios: 1,
  feriado_fecha: "",
  feriado_fijo: 1,
};

export { formularioBloqueos, formulariosFeriados };
