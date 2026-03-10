import type { propsFeriados } from "../../../core/entitites/propsFeriados.types";
import type {
  propsEspaciosDeTrabajo,
  propsTurnosBloqueados,
  propsTurnosSede,
} from "../../../core/entitites/propsReportes.types";
import { axiosInstance } from "../../adapters/axiosInstance";

export interface ApiResponse<T> {
  error: boolean;
  status: number;
  body: T;
  message?: string;
}

const getReporteTurnos = async (params: {
  fecha_a: string;
  fecha_b: string;
}) => {
  try {
    const response = await axiosInstance.get(`/admin_turnos/reportes_turnos`, {
      params,
    });
    return response;
  } catch (error) {
    console.error("Error al actualizar bloqueo", error);
    throw error;
  }
};

const getDiasFeriados = async (): Promise<ApiResponse<propsFeriados[]>> => {
  try {
    const response =
      await axiosInstance.get<ApiResponse<propsFeriados[]>>(`/turnos/feriados`);

    return response.data;
  } catch (error: any) {
    console.error("Error al obtener feriados", error);
    return {
      error: true,
      status: error.response?.status || 500,
      message: error.message || "Error desconocido",
      body: [],
    };
  }
};

const getEspaciosDeTrabajo = async (
  fk_sede: number,
): Promise<ApiResponse<propsEspaciosDeTrabajo[]>> => {
  try {
    const response = await axiosInstance.get<
      ApiResponse<propsEspaciosDeTrabajo[]>
    >(`/turnos/espacios_de_trabajo`, {
      params: { fk_sede },
    });

    return response.data;
  } catch (error: any) {
    console.error("Error espacios de trabajo", error);
    return {
      error: true,
      status: error.response?.status || 500,
      message: error.message || "Error desconocido",
      body: [],
    };
  }
};

const getTurnosBloqueados = async (): Promise<
  ApiResponse<propsTurnosBloqueados[]>
> => {
  try {
    const response = await axiosInstance.get<
      ApiResponse<propsTurnosBloqueados[]>
    >(`/turnos/turnos_bloqueados`);

    return response.data;
  } catch (error: any) {
    console.error("Error turnos bloqueados", error);
    return {
      error: true,
      status: error.response?.status || 500,
      message: error.message || "Error desconocido",
      body: [],
    };
  }
};

const getTurnosPorSede = async (params: {
  fecha_a: string;
  fecha_b: string;
  pk_sede: number;
}): Promise<ApiResponse<propsTurnosSede[]>> => {
  try {
    const response = await axiosInstance.get<ApiResponse<propsTurnosSede[]>>(
      `/turnos/turnos_por_sede`,
      {
        params,
      },
    );

    return response.data;
  } catch (error: any) {
    console.error("Error turnos por sede", error);
    return {
      error: true,
      status: error.response?.status || 500,
      message: error.message || "Error desconocido",
      body: [],
    };
  }
};

export {
  getReporteTurnos,
  getTurnosPorSede,
  getDiasFeriados,
  getEspaciosDeTrabajo,
  getTurnosBloqueados,
};
