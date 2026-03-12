import { useRef, useState } from "react";

import { formularioBloqueos, formulariosFeriados } from "../../utils/dataForms";
import { useAuthStore } from "../../../../app/store/useStore";
import {
  actualizarBloqueo,
  actualizarFeriado,
  eliminarBloqueo,
  eliminarFeriado,
  agregarBloqueo,
  agregarFeriado,
  getBloqueos,
  getFeriados,
  bloquearEspacio,
} from "../../../../infrastructure/api/turnos/adminTurnos";
import type {
  propsFormFeriados,
  propsFeriados,
} from "../../../../core/entitites/propsFeriados.types";
import type {
  propsFormBloqueos,
  propsBloqueos,
} from "../../../../core/entitites/propsBloqueos.types";

const useAdminTurnos = () => {
  const [bloqueosData, setBloqueosData] = useState<propsBloqueos[]>([]);
  const [feriadosData, setFeriadosData] = useState<propsFeriados[]>([]);
  const [totalPaginas, setTotalPaginas] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [formBloqueos, setFormBloqueos] =
    useState<propsFormBloqueos>(formularioBloqueos);
  const [formFeriados, setFormFeriados] =
    useState<propsFormFeriados>(formulariosFeriados);
  const [loading, setLoading] = useState(false);
  const [pagina, setPagina] = useState(0);
  const { user } = useAuthStore();

  const turnosBloqueados = async (offset: number) => {
    try {
      setLoading(true);

      const response = await getBloqueos({
        limit: 50,
        offset,
      });

      setBloqueosData(response.data.data);

      setTotalPaginas(response.data.totalPages);

      containerRef.current?.scrollTo({
        top: -1000,
        behavior: "smooth",
      });
    } catch (error) {
      console.error("Error al obtener turnos bloqueados", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const agregarBloqueoTurno = async () => {
    if (!formBloqueos.fecha_turno_bloqueo) {
      alert("La fecha es obligatoria");
      return;
    }

    if (!user?.idtusuarios) {
      console.error("Usuario no válido");
      return;
    }

    setLoading(true);

    try {
      const { idtturnos_bloqueados, ...body } = formBloqueos;

      const response = await agregarBloqueo({
        ...body,
        fk_usuarios: user.idtusuarios,
      });

      return response.data;
    } catch (error) {
      console.error("Error al agregar bloqueo", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const editarBloqueoTurno = async () => {
    try {
      setLoading(true);

      const bodyFinal = { ...formBloqueos, fk_usuarios: user?.idtusuarios! };
      const response = await actualizarBloqueo(bodyFinal);

      if (response.status === 200) {
        alert("Bloqueo actualizado correctamente");
        window.location.reload();
      }
    } catch (error) {
      console.error("Error al editar bloqueo", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const eliminarBloqueoTurno = async (idtturnos_bloqueados: number) => {
    try {
      setLoading(true);

      const bodyFinal = {
        idtturnos_bloqueados: idtturnos_bloqueados,
        fk_usuarios: user?.idtusuarios,
      };

      await eliminarBloqueo(bodyFinal);
      window.location.reload();
    } catch (error) {
      console.error("Error al eliminar bloqueo", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const feriados = async (offset: number) => {
    try {
      setLoading(true);
      const { data } = await getFeriados({
        limit: 40,
        offset,
      });

      setFeriadosData(data.data);

      setTotalPaginas(data.totalPages);

      containerRef.current?.scrollTo({
        top: -1000,
        behavior: "smooth",
      });
    } catch (error) {
      console.error("Error al obtener feriados", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const agregarFeriadoTurno = async () => {
    if (!user?.idtusuarios) return;

    if (!formFeriados.feriado_fecha) {
      alert("La fecha es obligatoria");
      return;
    }

    setLoading(true);

    try {
      const { idtferiados_turnos, ...body } = formFeriados;

      const bodyInsert = {
        ...body,
        fk_usuarios: user.idtusuarios,
      };

      await agregarFeriado(bodyInsert);

      window.location.reload();
    } catch (error) {
      console.error("Error al agregar feriado", error);
    } finally {
      setLoading(false);
    }
  };

  const editarFeriadoTurno = async () => {
    try {
      setLoading(true);

      if (!formFeriados.feriado_fecha) {
        alert("La fecha es obligatoria");
        return;
      }
      await actualizarFeriado(formFeriados);

      window.location.reload();
    } catch (error) {
      console.error("Error al editar feriado", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const eliminarFeriadoTurno = async (idtferiados_turnos: number) => {
    try {
      setLoading(true);

      const bodyFinal = {
        idtferiados_turnos: idtferiados_turnos,
        fk_usuarios: user?.idtusuarios,
      };

      await eliminarFeriado(bodyFinal);

      window.location.reload();
    } catch (error) {
      console.error("Error al eliminar feriado", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const bloquearEspaciosDeTrabajo = async (espacios: number[]) => {
    try {
      if (!espacios.length) {
        alert("Debe seleccionar al menos un consultorio");
        return;
      }

      setLoading(true);

      const crearBloqueo = await agregarBloqueoTurno();

      if (!crearBloqueo?.insertId) return;

      await Promise.all(
        espacios.map((espacio) =>
          bloquearEspacio({
            fk_espacios_de_trabajo: espacio,
            fk_turnos_bloq: crearBloqueo.insertId,
          }),
        ),
      );
      window.location.reload();
    } catch (error) {
      console.error("Error al bloquear espacios de trabajo", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    bloquearEspaciosDeTrabajo,
    eliminarBloqueoTurno,
    eliminarFeriadoTurno,
    agregarBloqueoTurno,
    agregarFeriadoTurno,
    editarBloqueoTurno,
    editarFeriadoTurno,
    turnosBloqueados,
    setFormBloqueos,
    setFormFeriados,
    setPagina,
    feriados,

    formFeriados,
    formBloqueos,
    totalPaginas,
    feriadosData,
    bloqueosData,
    containerRef,
    loading,
    pagina,
  };
};

export { useAdminTurnos };
