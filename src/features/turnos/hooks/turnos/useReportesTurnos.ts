import { useState } from "react";
import {
  getDiasFeriados,
  getEspaciosDeTrabajo,
  getReporteTurnos,
  getTurnosBloqueados,
  getTurnosPorSede,
} from "../../../../infrastructure/api/turnos/reportesTurnos";
import type {
  PropsDataReporte,
  propsEspaciosDeTrabajo,
  propsTurnosBloqueados,
  propsTurnosSede,
} from "../../../../core/entitites/propsReportes.types";
import type { propsFeriados } from "../../../../core/entitites/propsFeriados.types";

const useReportesTurnos = () => {
  const [fechas, setFecha] = useState({
    fecha_a: "",
    fecha_b: "",
  });
  const [loading, setLoading] = useState(false);
  const [dataReporte, setDataReporte] = useState<PropsDataReporte>({
    total: [],
    detalles: [],
    inasistencias: [],
  });
  const [sedes, setSedes] = useState<"Ambas sedes" | "Villa luro" | "Belgrano">(
    "Ambas sedes",
  );

  const reportesTurnos = async () => {
    try {
      if (!fechas.fecha_a || !fechas.fecha_b)
        return alert("Fechas obligatorias");

      setLoading(true);
      const sedesConsulta =
        sedes === "Ambas sedes"
          ? { fk_sede: [7, 11] }
          : { fk_sede: [sedes === "Belgrano" ? 11 : 7] };

      const params = { ...fechas, ...sedesConsulta };
      const response = await getReporteTurnos(params);

      setDataReporte(response.data);
      return response;
    } catch (error) {
      console.error("Error al obtener reportes de turnos", error);
    } finally {
      setLoading(false);
    }
  };

  const SLOTS = [
    "09:00",
    "09:30",
    "10:00",
    "10:30",
    "11:15",
    "11:45",
    "12:15",
    "14:00",
    "14:30",
    "15:00",
    "15:30",
    "16:15",
    "16:45",
    "17:15",
  ];

  // util: convierte Buffer-like -> número/string legible
  const bufferToVal = (maybeBuffer: any) => {
    if (maybeBuffer == null) return maybeBuffer;
    if (
      typeof maybeBuffer === "object" &&
      maybeBuffer.type === "Buffer" &&
      Array.isArray(maybeBuffer.data)
    ) {
      // si es un byte con 0/1 -> devolver 0/1 como number
      return maybeBuffer.data[0];
    }
    return maybeBuffer;
  };

  const toYYYYMMDD = (isoOrDate: string | Date) => {
    const d = typeof isoOrDate === "string" ? new Date(isoOrDate) : isoOrDate;
    // usar toISOString para normalizar y tomar la parte fecha
    return d.toISOString().split("T")[0];
  };

  const addDays = (date: Date, n: number) => {
    const d = new Date(date);
    d.setUTCDate(d.getUTCDate() + n);
    return d;
  };

  async function findDisponibilidadPorSede({
    pk_sede,
    startDate,
    daysRange = 7,
    maxWeeks = 12,
  }: {
    pk_sede: number;
    startDate?: string;
    daysRange?: number;
    maxWeeks?: number;
  }) {
    try {
      const start = startDate
        ? new Date(startDate + "T00:00:00Z")
        : addDays(new Date(), 1); // <-- mañana

      for (let week = 0; week < maxWeeks; week++) {
        const fechaIni = toYYYYMMDD(addDays(start, week * daysRange));
        const fechaFin = toYYYYMMDD(
          addDays(start, week * daysRange + (daysRange - 1)),
        );

        const [feriadosResp, turnosResp, espaciosResp, turnosBloqRep] =
          await Promise.all([
            getDiasFeriados(),
            getTurnosPorSede({
              fecha_a: fechaIni,
              fecha_b: fechaFin,
              pk_sede,
            }),
            getEspaciosDeTrabajo(pk_sede),
            getTurnosBloqueados(),
          ]);

        const feriados: propsFeriados[] = Array.isArray(feriadosResp.body)
          ? feriadosResp.body
          : [];

        const turnos: propsTurnosSede[] = Array.isArray(turnosResp.body)
          ? turnosResp.body
          : [];

        // EXCLUIR consultorio 37
        let espacios: propsEspaciosDeTrabajo[] = Array.isArray(
          espaciosResp.body,
        )
          ? espaciosResp.body.filter(
              (e: any) => Number(e.idtespacios_de_trabajo) !== 37,
            )
          : [];

        let bloqueos: propsTurnosBloqueados[] = Array.isArray(
          turnosBloqRep.body,
        )
          ? turnosBloqRep.body.filter(
              (e: any) => Number(e.turno_bloq_tipo) === 1,
            )
          : [];

        const bloqueosSet = new Set(
          bloqueos
            .filter((b) => Number(b.fk_cede) === pk_sede)
            .map((b) => toYYYYMMDD(b.turno_bloq_fecha)),
        );

        const feriadosSet = new Set(
          feriados.map((f) => toYYYYMMDD(f.feriado_fecha)),
        );

        // construir mapa de turnos ocupados
        const ocupados: Record<string, number[]> = {};
        for (const t of turnos) {
          const cancel = Number(bufferToVal(t.turno_cancelado));
          const sobre = Number(bufferToVal(t.turno_es_sobreturno));
          if (cancel !== 0 || sobre !== 0) continue;

          const espId = Number(t.fk_espacios_de_trabajo);
          const fecha = toYYYYMMDD(t.turno_fecha);
          const hora = t.turno_hora_ini.slice(0, 5);
          const key = `${fecha}|${hora}`;

          if (!ocupados[key]) ocupados[key] = [];
          ocupados[key].push(espId);
        }

        // buscar disponibilidad
        for (let d = 0; d < daysRange; d++) {
          const fecha = toYYYYMMDD(addDays(start, week * daysRange + d));
          if (feriadosSet.has(fecha)) continue;
          if (bloqueosSet.has(fecha)) continue;

          const dateObj = new Date(fecha + "T00:00:00");
          const dow = dateObj.getDay(); // 0=Dom, 6=Sab

          // 🟦 SEDE 7 → NO SÁBADO NI DOMINGO
          if (pk_sede === 7) {
            if (dow === 0 || dow === 6) continue;
          }

          // 🟦 SEDE 11 → DOMINGO NO, SÁBADO ESPECIAL
          let espaciosFiltrados = [...espacios];
          let slotsFiltrados = [...SLOTS];

          if (pk_sede === 11) {
            if (dow === 0) continue; // domingo

            if (dow === 6) {
              // sábado
              // excluir consultorio 71
              espaciosFiltrados = espaciosFiltrados.filter(
                (e) => Number(e.idtespacios_de_trabajo) !== 71,
              );

              // solo hasta 12:15
              slotsFiltrados = slotsFiltrados.filter((s) => s <= "12:15");
            }
          }

          const espaciosActivos = espaciosFiltrados.filter(
            (e) => Number(e.espt_turnos_completos) === 1,
          );

          if (!espaciosActivos.length) continue;

          // iterar horarios
          for (const slot of slotsFiltrados) {
            const key = `${fecha}|${slot}`;
            const ocupadosIds = ocupados[key] ?? [];

            const libre = espaciosActivos.find(
              (e) => !ocupadosIds.includes(Number(e.idtespacios_de_trabajo)),
            );

            if (libre) {
              return {
                fecha,
                hora: slot,
                idtespacios_de_trabajo: Number(libre.idtespacios_de_trabajo),
                fk_cede: Number(libre.fk_cede),
              };
            }
          }
        }
      }

      return null;
    } catch (error) {
      console.log("Error obteniendo próximos turnos disponibles");
    }
  }
  return {
    findDisponibilidadPorSede,
    reportesTurnos,
    setLoading,
    setFecha,
    setSedes,

    dataReporte,
    loading,
    fechas,
    sedes,
  };
};
export { useReportesTurnos };
