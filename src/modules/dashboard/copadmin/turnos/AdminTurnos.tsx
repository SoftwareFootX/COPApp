import { useEffect, useState } from "react";
import { Container } from "../../../../ui/components";
import { DayPicker } from "react-day-picker";
import "react-day-picker/dist/style.css";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useData } from "../../../../features/turnos/hooks/useData";
import type {
  propsEspaciosPorConsultorio,
  propsSedesPorConsultorio,
} from "../../../../core/entitites/propsConsultorio.types";
import { Spinner } from "../../../../app/components/Spinner";
import { Historial } from "./components/Historial";

type Modo = "feriado" | "bloqueo";

const AdminTurnos = () => {
  const {
    sedesPorConsultorio,
    espaciosPorSede,

    espaciosConsul,
    sedesConsul,
    loading,
  } = useData();

  const [modo, setModo] = useState<Modo>("bloqueo");
  const [fechaSeleccionada, setFechaSeleccionada] = useState<Date | undefined>(
    new Date(),
  );

  const [consultoriosSeleccionados, setConsultoriosSeleccionados] = useState<
    number[]
  >([]);
  const [tipoDeBloqueo, setTipoDeBloqueo] = useState<string>("T1");
  const [sede, setSede] = useState<number>(7);
  const [motivo, setMotivo] = useState<string>("");
  const [descripcionFeriado, setDescripcionFeriado] = useState("");

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
    if (!fechaSeleccionada) return;
  };

  useEffect(() => {
    sedesPorConsultorio(2);
  }, []);

  useEffect(() => {
    espaciosPorSede(sede);
  }, [sede]);

  return (
    <Container>
      <div className="p-2 sm:p-3 bg-background-light text-slate-900 flex flex-col h-auto w-full">
        <main className="mx-auto w-full py-1 sm:py-2 flex flex-col gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl lg:text-3xl font-black">
              Panel de Administración de turnos
            </h1>
            <p className="text-gray-700 text-sm">
              Gestiona feriados y bloqueos de agenda para tus consultorios.
            </p>
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
                onSelect={setFechaSeleccionada}
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
                        value={sede}
                        onChange={(e) => setSede(Number(e.target.value))}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
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
                        value={tipoDeBloqueo}
                        onChange={(e) => setTipoDeBloqueo(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                      >
                        <option value="T1">Todo el día</option>
                        <option value="T2">Primer turno ( 9h - 13h)</option>
                        <option value="T3">Segundo turno ( 14h - 18h )</option>
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
                        value={motivo}
                        onChange={(e) => setMotivo(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                        placeholder="Ej: Falta de técnicos"
                      />
                    </div>
                  </div>
                )}

                {modo === "feriado" && (
                  <div className="mt-3">
                    <div className="flex flex-col gap-1">
                      <label className="text-xs sm:text-sm font-bold">
                        Descripción del feriado (opcional)
                      </label>
                      <input
                        value={descripcionFeriado}
                        onChange={(e) => setDescripcionFeriado(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                        placeholder="Ej: Feriado Nacional"
                      />
                    </div>
                  </div>
                )}

                <button
                  disabled={true}
                  onClick={handleAgregar}
                  className="flex-1 w-full mt-3 bg-primary cursor-pointer hover:bg-primary/90 text-white font-bold py-2 px-4 rounded-lg shadow-md shadow-primary/20 transition-all text-sm"
                >
                  {modo === "bloqueo" ? "Agregar bloqueo" : "Agregar feriado"}
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
