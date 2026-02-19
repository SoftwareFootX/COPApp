import { axiosInstance } from "../adapters/axiosInstance";
import type {
  propsHistorialVista,
  ApiResponseVista,
  propsHistorial,
} from "../../core/entitites/propsAttclie.types";

const getHistorial = async (params: {
  nro_de_pagina: number;
  tamanio_pagina: number;
  dato_busqueda: string;
}): Promise<ApiResponseVista<propsHistorialVista[]>> => {
  try {
    const response = await axiosInstance.get<
      ApiResponseVista<propsHistorialVista[]>
    >("/attclie/historial_de_atenciones", { params });

    return response.data;
  } catch (error: any) {
    console.error("Error al obtener historial de atenciones", error);
    return {
      error: true,
      status: error.response?.status || 500,
      message: error.message || "Error desconocido",
      body: {
        data: [],
        totalRegistros: 0,
        totalPaginas: 0,
        nro_de_pagina: "0",
        tamanio_pagina: "0",
      },
    };
  }
};

const editHistorial = async (body: propsHistorial) => {
  try {
    const response = await axiosInstance.patch(
      "/attclie/actualizar_historial",
      body,
    );

    return response.data;
  } catch (error: any) {
    console.error("Error al editar historial de atenciones", error);
  }
};

const agregarHistorial = async (body: propsHistorial) => {
  try {
    const response = await axiosInstance.post(
      "/attclie/agregar_historial",
      body,
    );

    return response.data;
  } catch (error: any) {
    console.error("Error al editar historial de atenciones", error);
  }
};

const getHistorialPorId = async (id: number) => {
  try {
    const response = await axiosInstance.get("/attclie/historial_por_id", {
      params: { idtatenciones_al_cliente: id },
    });

    return response.data;
  } catch (error: any) {
    console.error("Error al editar historial de atenciones", error);
  }
};

const eliminarHistorialPorId = async (id: number) => {
  try {
    const response = await axiosInstance.delete("/attclie/eliminar_historial", {
      params: { idtatenciones_al_cliente: id },
    });

    return response.data;
  } catch (error: any) {
    console.error("Error al eliminar historial de atenciones", error);
  }
};

export {
  eliminarHistorialPorId,
  getHistorialPorId,
  agregarHistorial,
  editHistorial,
  getHistorial,
};
