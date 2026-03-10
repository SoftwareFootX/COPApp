import type {
  propsBloqueos,
  propsFormBloqueos,
} from "../../../core/entitites/propsBloqueos.types";
import type {
  propsFeriados,
  propsFormFeriados,
} from "../../../core/entitites/propsFeriados.types";
import { axiosInstance } from "../../adapters/axiosInstance";

interface ApiResponsePaginado<T> {
  data: T;
  totalPages: number;
}

const getBloqueos = async (params: { limit: number; offset: number }) => {
  try {
    const response = await axiosInstance.get<
      ApiResponsePaginado<propsBloqueos[]>
    >("/admin_turnos/turnos_bloqueados", { params });

    return response;
  } catch (error) {
    console.error("Error al obtener turnos bloqueados", error);
    throw error;
  }
};

const agregarBloqueo = async (body: propsFormBloqueos) => {
  try {
    const response = await axiosInstance.post<propsFormBloqueos[]>(
      "/admin_turnos/agregar_bloqueo",
      body,
    );

    return response;
  } catch (error) {
    console.error("Error al agregar bloqueo", error);
    throw error;
  }
};

const actualizarBloqueo = async (body: propsFormBloqueos) => {
  try {
    const response = await axiosInstance.patch<propsFormBloqueos[]>(
      "/admin_turnos/actualizar_bloqueo",
      body,
    );

    return response;
  } catch (error) {
    console.error("Error al actualizar bloqueo", error);
    throw error;
  }
};

const eliminarBloqueo = async (body: any) => {
  try {
    const response = await axiosInstance.patch(
      "/admin_turnos/ocultar_bloqueo",
      body,
    );

    return response;
  } catch (error) {
    console.error("Error al eliminar bloqueo", error);
    throw error;
  }
};

const getFeriados = async (params: { limit: number; offset: number }) => {
  try {
    const response = await axiosInstance.get<
      ApiResponsePaginado<propsFeriados[]>
    >("/admin_turnos/feriados", { params });

    return response;
  } catch (error) {
    console.error("Error al obtener feriados", error);
    throw error;
  }
};

const agregarFeriado = async (body: propsFormFeriados) => {
  try {
    const response = await axiosInstance.post<propsFormFeriados[]>(
      "/admin_turnos/agregar_feriado",
      body,
    );

    return response;
  } catch (error) {
    console.error("Error al agregar feriado", error);
    throw error;
  }
};

const actualizarFeriado = async (body: propsFormFeriados) => {
  try {
    const response = await axiosInstance.patch<propsFormFeriados[]>(
      "/admin_turnos/actualizar_feriado",
      body,
    );

    return response;
  } catch (error) {
    console.error("Error al actualizar feriado", error);
    throw error;
  }
};

const eliminarFeriado = async (body: any) => {
  try {
    const response = await axiosInstance.patch(
      "/admin_turnos/ocultar_feriado",
      { data: body },
    );

    return response;
  } catch (error) {
    console.error("Error al eliminar feriado", error);
    throw error;
  }
};

export {
  getBloqueos,
  agregarBloqueo,
  actualizarBloqueo,
  eliminarBloqueo,
  getFeriados,
  agregarFeriado,
  actualizarFeriado,
  eliminarFeriado,
};
