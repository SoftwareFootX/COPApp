import { useState } from "react";
import {
  getEspaciosPorConsultorio,
  getSedesPorConsultorio,
} from "../../../infrastructure/api/consultorios";
import type {
  propsEspaciosPorConsultorio,
  propsSedesPorConsultorio,
} from "../../../core/entitites/propsConsultorio.types";

const useData = () => {
  const [sedesConsul, setSedesConsul] = useState<propsSedesPorConsultorio[]>(
    [],
  );
  const [espaciosConsul, setEspaciosConsul] = useState<
    propsEspaciosPorConsultorio[]
  >([]);
  const [loading, setLoading] = useState(false);

  const sedesPorConsultorio = async (idtconsultorios: number) => {
    try {
      setLoading(true);
      const response = await getSedesPorConsultorio({ idtconsultorios });

      setSedesConsul(response.data);
    } catch (error) {
      console.error("Error al obtener sedes por consultorio", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const espaciosPorSede = async (fk_sede: number) => {
    try {
      setLoading(true);
      const response = await getEspaciosPorConsultorio({ fk_sede });

      setEspaciosConsul(response.data);
    } catch (error) {
      console.error("Error al obtener espacios por sede", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    sedesPorConsultorio,
    espaciosPorSede,

    espaciosConsul,
    sedesConsul,
    loading,
  };
};

export { useData };
