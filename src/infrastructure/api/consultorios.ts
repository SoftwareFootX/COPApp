import type {
  propsEspaciosPorConsultorio,
  propsSedesPorConsultorio,
} from "../../core/entitites/propsConsultorio.types";
import { axiosInstance } from "../adapters/axiosInstance";

const getSedesPorConsultorio = async (params: { idtconsultorios: number }) => {
  try {
    const response = await axiosInstance.get<propsSedesPorConsultorio[]>(
      "/consultorios_v2/sedes_por_consultorio",
      { params },
    );

    return response;
  } catch (error) {
    console.error("Error al obtener sedes por consultorio", error);
    throw error;
  }
};

const getEspaciosPorConsultorio = async (params: { fk_sede: number }) => {
  try {
    const response = await axiosInstance.get<propsEspaciosPorConsultorio[]>(
      "/consultorios_v2/espacios_de_trabajo",
      { params },
    );

    return response;
  } catch (error) {
    console.error("Error al obtener espacios por sede", error);
    throw error;
  }
};

export { getSedesPorConsultorio, getEspaciosPorConsultorio };
