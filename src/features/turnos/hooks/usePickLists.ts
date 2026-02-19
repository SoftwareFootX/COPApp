import { useState } from "react";
import { axiosInstance } from "../../../infrastructure/adapters/axiosInstance";
import type {
  EstadoAtencion,
  TipoSoftware,
  TipoAtencion,
  TipoHardware,
  Consultorios,
} from "../../../core/entitites/propsAttclie.types";

const usePickLists = () => {
  const [estadosAtencion, setEstadosAtencion] = useState<EstadoAtencion[]>([]);
  const [tiposAtencion, setTiposAtencion] = useState<TipoAtencion[]>([]);
  const [consultorios, setConsultorios] = useState<Consultorios[]>([]);
  const [softwares, setSoftwares] = useState<TipoSoftware[]>([]);
  const [hardwares, setHardwares] = useState<TipoHardware[]>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPickLists = async () => {
    setLoading(true);
    setError(null);

    try {
      const [softwareRes, tipoAtencionRes, hardwareRes, estadoAtencionRes] =
        await Promise.all([
          axiosInstance.get("/attclie/tipos_software"),
          axiosInstance.get("/attclie/tipos_de_atencion"),
          axiosInstance.get("/attclie/tipos_hardware"),
          axiosInstance.get("/attclie/estado_atencion"),
        ]);

      setSoftwares(softwareRes.data.body);
      setTiposAtencion(tipoAtencionRes.data.body);
      setHardwares(hardwareRes.data.body);
      setEstadosAtencion(estadoAtencionRes.data.body);
    } catch (err) {
      console.error(err);
      setError("Error al cargar listas");
    } finally {
      setLoading(false);
    }
  };

  const listadoDeTerceros = async () => {
    try {
      const response = await axiosInstance.get(
        "/consultorios/listar_consultorios",
      );
      setConsultorios(response.data.body);
    } catch (err) {
      console.error(err);
      setError("Error al cargar consultorios");
    } finally {
      setLoading(false);
    }
  };

  return {
    softwares,
    tiposAtencion,
    hardwares,
    estadosAtencion,
    consultorios,

    loading,
    error,

    fetchPickLists,
    listadoDeTerceros,
  };
};

export { usePickLists };
