interface propsSedesPorConsultorio {
  idtcedes_por_consultorios: number;
  cede_descr_en_server: string;
}

interface propsEspaciosPorConsultorio {
  idtespacios_de_trabajo: number;
  fk_cede: number;
  espt_descripcion: string;
  espt_turnos_completos: number;
}

export type { propsSedesPorConsultorio, propsEspaciosPorConsultorio };
