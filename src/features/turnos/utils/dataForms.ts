const formularioBloqueos = {
  idtturnos_bloqueados: 1,
  fk_sede: 1,
  fecha_turno_bloqueo: "",
  turno_bloq_tipo: 1,
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
