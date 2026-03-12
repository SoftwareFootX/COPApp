import { useEffect, useState } from "react";

import { Container } from "../../../../ui/components";
import { useNavigate } from "react-router-dom";
import { GoArrowLeft } from "react-icons/go";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { es } from "date-fns/locale";
import { format } from "date-fns";

import { useAdminTurnos } from "../../../../features/turnos/hooks/turnos/useAdminTurnos";
import type { propsFormFeriados } from "../../../../core/entitites/propsFeriados.types";
import type { propsFormBloqueos } from "../../../../core/entitites/propsBloqueos.types";
import { useData } from "../../../../features/turnos/hooks/useData";
import { Spinner } from "../../../../app/components/Spinner";
import type {
  propsEspaciosPorConsultorio,
  propsSedesPorConsultorio,
} from "../../../../core/entitites/propsConsultorio.types";
import { Historial } from "./components/Historial";

const AdminTurnos = () => {
  const {
    sedesPorConsultorio,
    espaciosPorSede,

    espaciosConsul,
    sedesConsul,
    loading,
  } = useData();

  const {
    bloquearEspaciosDeTrabajo,
    agregarFeriadoTurno,
    setFormBloqueos,
    setFormFeriados,

    formBloqueos,
    formFeriados,
    loading: loadingData,
  } = useAdminTurnos();
  const navigate = useNavigate();

  const [modo, setModo] = useState(() => {
    return sessionStorage.getItem("modo") || "bloqueo";
  });

  useEffect(() => {
    sessionStorage.setItem("modo", modo);
  }, [modo]);

  const [fechaSeleccionada, setFechaSeleccionada] = useState<Date | undefined>(
    new Date(),
  );

  const [consultoriosSeleccionados, setConsultoriosSeleccionados] = useState<
    number[]
  >([]);

  const toggleConsultorio = (id: number | "ALL") => {
    if (id === "ALL") {
      setConsultoriosSeleccionados((prev) =>
        prev.length === espaciosConsul.length
          ? []
          : espaciosConsul.map((c) => c.idtespacios_de_trabajo),
      );
      return;
    }

    setConsultoriosSeleccionados((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id],
    );
  };

  const handleAgregar = () => {
    modo === "bloqueo"
      ? bloquearEspaciosDeTrabajo(consultoriosSeleccionados)
      : agregarFeriadoTurno();
  };

  useEffect(() => {
    sedesPorConsultorio(2);
  }, []);

  useEffect(() => {
    espaciosPorSede(formBloqueos.fk_sede);
  }, [formBloqueos.fk_sede]);

  return (
    <Container>
      <div className="p-2 sm:p-3 bg-background-light text-slate-900 flex flex-col h-auto w-full">
        <main className="mx-auto w-full py-1 sm:py-2 flex flex-col gap-4">
          <div className="flex items-center gap-2 sm:gap-5">
            <button
              onClick={() => navigate("/COPAdmin")}
              className="text-primary cursor-pointer"
            >
              <GoArrowLeft size={30} />
            </button>
            <div className="flex flex-col">
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-black">
                Panel de Administración de turnos
              </h1>
              <p className="text-gray-700 text-sm">
                Gestiona feriados y bloqueos de agenda para tus consultorios.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1">
            <div className="lg:col-span-5 bg-white p-3 sm:p-4 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex p-0.5 bg-slate-100 rounded-xl w-full shadow-sm gap-1 mb-2">
                <button
                  onClick={() => setModo("feriado")}
                  className={`flex-1 px-3 sm:px-5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                    modo === "feriado"
                      ? "bg-primary text-white shadow-sm"
                      : "text-slate-600 hover:text-slate-900"
                  } cursor-pointer`}
                >
                  Feriados
                </button>

                <button
                  onClick={() => setModo("bloqueo")}
                  className={`flex-1 px-3 sm:px-5 py-1.5 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
                    modo === "bloqueo"
                      ? "bg-primary text-white shadow-sm"
                      : "text-slate-600 hover:text-slate-900"
                  } cursor-pointer`}
                >
                  Bloqueos
                </button>
              </div>

              <DayPicker
                mode="single"
                selected={fechaSeleccionada}
                onSelect={(e) => {
                  setFechaSeleccionada(e);
                  if (modo === "bloqueo") {
                    setFormBloqueos((prev: propsFormBloqueos) => ({
                      ...prev,
                      fecha_turno_bloqueo: e?.toISOString().split("T")[0] ?? "",
                    }));
                  } else {
                    setFormFeriados((prev: propsFormFeriados) => ({
                      ...prev,
                      feriado_fecha: e?.toISOString().split("T")[0] ?? "",
                    }));
                  }
                }}
                locale={es}
                disabled={loading}
                className="w-full text-sm"
              />
            </div>

            <div className="lg:col-span-7 flex flex-col gap-3">
              <div className="bg-white p-3 sm:p-4 rounded-xl border border-slate-200 shadow-sm flex-1">
                <div className="flex justify-between items-center">
                  <div className="mb-4">
                    <h2 className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-1">
                      Fecha Seleccionada
                    </h2>
                    <p className="text-lg sm:text-xl lg:text-2xl font-black leading-snug">
                      {fechaSeleccionada
                        ? format(fechaSeleccionada, "EEEE, d 'de' MMMM yyyy", {
                            locale: es,
                          })
                        : "Seleccione una fecha"}
                    </p>
                  </div>
                  <div>
                    <Spinner loading={loading} />
                  </div>
                </div>

                {modo === "bloqueo" && (
                  <div className="space-y-3">
                    <div className="flex flex-col gap-1">
                      <label className="text-xs sm:text-sm font-bold">
                        Seleccione Sede
                      </label>
                      <select
                        disabled={loading}
                        value={formBloqueos.fk_sede}
                        onChange={(e) => {
                          setFormBloqueos((prev: propsFormBloqueos) => ({
                            ...prev,
                            fk_sede: Number(e.target.value),
                          }));
                        }}
                        className="w-full h-10 cursor-pointer bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                      >
                        {sedesConsul.map((sede: propsSedesPorConsultorio) => (
                          <option
                            key={sede.idtcedes_por_consultorios}
                            value={sede.idtcedes_por_consultorios}
                          >
                            {sede.cede_descr_en_server}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-xs sm:text-sm font-bold">
                        Seleccione tipo de bloqueo
                      </label>
                      <select
                        disabled={loading}
                        value={formBloqueos.turno_bloq_tipo}
                        onChange={(e) => {
                          setFormBloqueos((prev: propsFormBloqueos) => ({
                            ...prev,
                            turno_bloq_tipo: Number(e.target.value),
                          }));
                        }}
                        className="w-full h-10 cursor-pointer bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                      >
                        <option value="1">Todo el día</option>
                        <option value="2">Primer turno ( 9h - 13h )</option>
                        <option value="3">Segundo turno ( 14h - 18h )</option>
                      </select>
                    </div>

                    <div className="flex flex-col gap-2">
                      <label className="text-xs sm:text-sm font-bold">
                        Seleccione qué consultorios desea bloquear
                      </label>

                      <div className="flex flex-col gap-2 bg-slate-50 border border-slate-200 rounded-lg p-3">
                        <label className="flex items-center gap-2 cursor-pointer text-sm">
                          <input
                            type="checkbox"
                            disabled={loading}
                            checked={
                              espaciosConsul.length > 0 &&
                              consultoriosSeleccionados.length ===
                                espaciosConsul.length
                            }
                            onChange={() => toggleConsultorio("ALL")}
                            className="accent-primary"
                          />
                          Todos los consultorios
                        </label>

                        {espaciosConsul.map(
                          (c: propsEspaciosPorConsultorio) => (
                            <label
                              key={c.idtespacios_de_trabajo}
                              className="flex items-center gap-2 cursor-pointer text-sm"
                            >
                              <input
                                type="checkbox"
                                disabled={loading}
                                checked={consultoriosSeleccionados.includes(
                                  c.idtespacios_de_trabajo,
                                )}
                                onChange={() =>
                                  toggleConsultorio(c.idtespacios_de_trabajo)
                                }
                                className="accent-primary"
                              />
                              {c.espt_descripcion}
                            </label>
                          ),
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col gap-1">
                      <label className="text-xs sm:text-sm font-bold">
                        Motivo del bloqueo (opcional)
                      </label>
                      <input
                        disabled={loading}
                        value={formBloqueos.turno_bloq_descripcion}
                        onChange={(e) => {
                          setFormBloqueos((prev: propsFormBloqueos) => ({
                            ...prev,
                            turno_bloq_descripcion: e.target.value,
                          }));
                        }}
                        className="w-full bg-slate-50 border h-10 cursor-pointer border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                        placeholder="Ej: Falta de técnicos"
                      />
                    </div>
                  </div>
                )}

                {modo === "feriado" && (
                  <label className="flex items-center gap-2 cursor-pointer text-sm">
                    <input
                      type="checkbox"
                      disabled={loading}
                      checked={formFeriados.feriado_fijo === 1}
                      onChange={(e) =>
                        setFormFeriados((prev: propsFormFeriados) => ({
                          ...prev,
                          feriado_fijo: e.target.checked ? 1 : 0,
                        }))
                      }
                      className="accent-primary"
                    />
                    Feriado fijo
                  </label>
                )}

                <button
                  onClick={handleAgregar}
                  disabled={loading || loadingData}
                  className={`flex-1 w-full mt-3 ${loading || loadingData ? "bg-primary/60" : "bg-primary"} cursor-pointer hover:bg-primary/90 text-white font-bold py-2 px-4 rounded-lg shadow-md shadow-primary/20 transition-all text-sm`}
                >
                  {loadingData ? (
                    "Espere por favor..."
                  ) : (
                    <>
                      {modo === "bloqueo"
                        ? "Agregar bloqueo"
                        : "Agregar feriado"}
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </main>
        <Historial modo={modo} />
      </div>
    </Container>
  );
};

export { AdminTurnos };
