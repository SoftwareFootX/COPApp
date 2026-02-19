import { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import { formatDate, normalizeText } from "../utils/utils";
import { useAuthStore } from "../../../app/store/useStore";
import {
  eliminarHistorialPorId,
  getHistorialPorId,
  agregarHistorial,
  editHistorial,
  getHistorial,
} from "../../../infrastructure/api/historialDeAtencion";
import type {
  propsHistorialVista,
  propsHistorial,
} from "../../../core/entitites/propsAttclie.types";
import { editHistorialForm } from "../utils/states";

const useHistorial = () => {
  const [historialDeAtencion, setHistorialDeAtencion] = useState<
    propsHistorialVista[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [totalPaginas, setTotalPaginas] = useState(0);
  const [alertModal, setAlertModal] = useState(false);
  const titleAlert = useRef("");

  const [editHisDeAtencion, setEditHisDeAtencion] =
    useState<propsHistorial>(editHistorialForm);

  const navigate = useNavigate();

  const { user } = useAuthStore();

  const historialDeSoportes = async (
    nro_de_pagina: number,
    tamanio_pagina: number,
    dato_busqueda: string,
  ) => {
    try {
      setLoading(true);
      const response = await getHistorial({
        nro_de_pagina,
        tamanio_pagina,
        dato_busqueda,
      });

      if (!response.error) {
        setHistorialDeAtencion(response.body.data);
        setTotalPaginas(response.body.totalPaginas);
        return;
      }
    } catch (error) {
      console.log("Error obteniendo historial de soportes: ", error);
    } finally {
      setLoading(false);
    }
  };

  const editarHisDeSoportes = async (id: number) => {
    try {
      setLoading(true);
      if (!id) return;

      const { atendido_por, ...rest } = editHisDeAtencion;

      const response = await editHistorial(rest);
      if (!response.error) {
        titleAlert.current = "Ticket editado correctamente";
        setAlertModal(true);
        setTimeout(() => {
          navigate("/soportes");
        }, 1000);
        return;
      }
    } catch (error) {
      console.log("Error editando historial de soportes: ", error);
    } finally {
      setLoading(false);
    }
  };

  const nuevoHisDeSoporte = async () => {
    try {
      setLoading(true);

      const { idtatenciones_al_cliente, atendido_por, ...rest } =
        editHisDeAtencion;
      const bodyFinal = {
        ...rest,
        fk_usuario_atiende: user?.idtusuarios!,
        fk_usuarios: user?.idtusuarios!,
      };

      const response = await agregarHistorial(bodyFinal);
      if (!response.error) {
        titleAlert.current = "Ticket agregado correctamente";
        setAlertModal(true);
        setTimeout(() => {
          navigate("/soportes");
        }, 1000);
        return;
      }
    } catch (error) {
      console.log("Error editando historial de soportes: ", error);
    } finally {
      setLoading(false);
    }
  };

  const historialPorId = async (id: number) => {
    try {
      setLoading(true);
      if (!id) return;
      const response = await getHistorialPorId(id);
      if (!response.error) {
        const { body } = response;
        setEditHisDeAtencion({
          idtatenciones_al_cliente: body[0].idtatenciones_al_cliente,
          fk_consultorio: body[0].fk_consultorio,
          fk_tipo_atencion: body[0].fk_tipo_atencion,
          fk_usuarios: body[0].fk_usuarios,
          fk_software: body[0].fk_software,
          fk_hardware: body[0].fk_hardware,
          fk_usuario_atiende: body[0].fk_usuario_atiende,
          fk_estado_atencion: body[0].fk_estado_atencion,
          atclie_fecha: body[0].atclie_fecha.split("T")[0],
          atclie_descripcion: normalizeText(body[0].atclie_descripcion),
          atcliente_duracion: body[0].atcliente_duracion,
          atendido_por: body[0].atendido_por,
        });
        return;
      }
    } catch (error) {
      console.log("Error editando historial de soportes: ", error);
    } finally {
      setLoading(false);
    }
  };

  const eliminarTicket = async (
    id: number,
    atclie_fecha: string,
    consul_denominacion_cop: string,
  ) => {
    if (!id) return;

    const confirmar = window.confirm(
      `¿Seguro que querés eliminar el ticket de ${consul_denominacion_cop} - ${formatDate(atclie_fecha)}? Esta acción no se puede deshacer.`,
    );

    if (!confirmar) return;

    try {
      setLoading(true);

      const response = await eliminarHistorialPorId(id);

      if (!response.error) {
        titleAlert.current = "Ticket eliminado correctamente";
        setAlertModal(true);

        setTimeout(() => {
          window.location.reload();
        }, 1000);
        return;
      }
    } catch (error) {
      console.log(`Error al eliminar el ticket ${id}`);
    } finally {
      setLoading(false);
    }
  };

  return {
    setEditHisDeAtencion,
    historialDeSoportes,
    editarHisDeSoportes,
    nuevoHisDeSoporte,
    eliminarTicket,
    historialPorId,
    setAlertModal,

    historialDeAtencion,
    editHisDeAtencion,
    totalPaginas,
    titleAlert,
    alertModal,
    loading,
  };
};

export { useHistorial };
