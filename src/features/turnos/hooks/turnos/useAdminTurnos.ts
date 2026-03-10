import { useRef, useState } from "react";

import { formularioBloqueos, formulariosFeriados } from "../../utils/dataForms";
import type {
  propsFormFeriados,
  propsFeriados,
} from "../../../../core/entitites/propsFeriados.types";
import type {
  propsFormBloqueos,
  propsBloqueos,
} from "../../../../core/entitites/propsBloqueos.types";
import {
  actualizarBloqueo,
  actualizarFeriado,
  eliminarBloqueo,
  eliminarFeriado,
  agregarBloqueo,
  agregarFeriado,
  getBloqueos,
  getFeriados,
} from "../../../../infrastructure/api/turnos/adminTurnos";
import { useAuthStore } from "../../../../app/store/useStore";

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
  const [pagina, setPagina] = useState(1);
  const { user } = useAuthStore();

  const turnosBloqueados = async (offset: number) => {
    try {
      setLoading(true);
      const response = await getBloqueos({
        limit: 8,
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
    try {
      setLoading(true);
      const { idtturnos_bloqueados, ...bodyFinal } = formBloqueos;

      const response = await agregarBloqueo(bodyFinal);

      console.log("Nuevo ID: ", response);
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
        await turnosBloqueados(pagina);
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

      const response = await eliminarBloqueo(bodyFinal);

      console.log("Bloqueo eliminado: ", response);
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
      const response = await getFeriados({
        limit: 20,
        offset,
      });

      setFeriadosData(response.data.data);

      setTotalPaginas(response.data.totalPages);

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
    try {
      setLoading(true);
      const { idtferiados_turnos, ...bodyFinal } = formFeriados;

      // return console.log("Form: ", bodyFinal);
      const response = await agregarFeriado(bodyFinal);

      console.log("Nuevo ID: ", response);
    } catch (error) {
      console.error("Error al agregar feriado", error);
      throw error;
    }
  };

  const editarFeriadoTurno = async () => {
    try {
      setLoading(true);

      const response = await actualizarFeriado(formFeriados);

      console.log("Feriado editado: ", response);
    } catch (error) {
      console.error("Error al editar feriado", error);
      throw error;
    }
  };

  const eliminarFeriadoTurno = async (idtferiados_turnos: number) => {
    try {
      setLoading(true);

      const bodyFinal = {
        idtferiados_turnos: idtferiados_turnos,
        fk_usuarios: user?.idtusuarios,
      };
      const response = await eliminarFeriado(bodyFinal);

      console.log("Feriado eliminado: ", response);
    } catch (error) {
      console.error("Error al eliminar feriado", error);
      throw error;
    }
  };

  return {
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
