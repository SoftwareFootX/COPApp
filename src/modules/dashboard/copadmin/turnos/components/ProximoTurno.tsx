import { useEffect, useState } from "react";

import { LuCopy, LuCopyCheck } from "react-icons/lu";
import { RxUpdate } from "react-icons/rx";

import { useReportesTurnos } from "../../../../../features/turnos/hooks/turnos/useReportesTurnos";
import { Spinner } from "../../../../../app/components/Spinner";

const ProximoTurno = () => {
  const { findDisponibilidadPorSede } = useReportesTurnos();

  const [turno7, setTurno7] = useState<any>(null);
  const [turno11, setTurno11] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [copiado, setCopiado] = useState(false);

  async function getProximosTurnos({
    sedes = [7],
    startDate,
    daysRange = 7,
    maxWeeks = 12,
  }: {
    sedes?: number[];
    startDate?: string;
    daysRange?: number;
    maxWeeks?: number;
  }) {
    const promisos = sedes.map((s) =>
      findDisponibilidadPorSede({
        pk_sede: s,
        startDate,
        daysRange,
        maxWeeks,
      }).then((r) => ({ sede: s, result: r })),
    );

    const results = await Promise.all(promisos);

    if (sedes.length === 1) return results[0].result;

    const proximos_turnos: Record<number, any> = {};
    for (const r of results) proximos_turnos[r.sede] = r.result;

    return proximos_turnos;
  }

  const getProximos = async () => {
    try {
      setLoading(true);
      const [belgrano, villaluro] = await Promise.all([
        getProximosTurnos({ sedes: [11], daysRange: 7, maxWeeks: 12 }),
        getProximosTurnos({ sedes: [7], daysRange: 7, maxWeeks: 12 }),
      ]);

      setTurno11(belgrano);
      setTurno7(villaluro);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProximos();
  }, []);

  const handleCopy = () => {
    const texto = `Villa Luro: ${turno7.fecha} - ${turno7.hora}
Belgrano: ${turno11.fecha} - ${turno11.hora}`;

    navigator.clipboard.writeText(texto);

    setCopiado(true);
    setTimeout(() => setCopiado(false), 1200);
  };

  return (
    <div className="bg-white mb-3 shadow-lg rounded-2xl p-4 flex flex-col gap-3">
      <div className="flex justify-between items-center">
        <button
          onClick={getProximos}
          disabled={loading}
          className={`bg-white shadow-md ${loading ? "text-primary/60 border-primary/60" : "text-primary border-primary"}  border p-1 mb- rounded-lg hover:opacity-90 transition cursor-pointer flex items-center justify-center w-7 h-7`}
        >
          <RxUpdate size={16} />
        </button>

        <div className="flex justify-center items-center gap-5 w-full">
          <div className="text-sm text-primary font-medium text-center">
            Próximos turnos disponibles
          </div>
          <div>
            <Spinner loading={loading} />
          </div>
        </div>

        {turno7?.fecha && turno11?.fecha && (
          <button
            onClick={handleCopy}
            disabled={loading}
            className="bg-white text-primary shadow-md border border-primary p-1 mb- rounded-lg hover:opacity-90 transition cursor-pointer flex items-center justify-center w-7 h-7"
          >
            <span className="relative flex items-center justify-center">
              <LuCopy
                className={`absolute transition-all duration-300 ${
                  copiado ? "opacity-0 scale-75" : "opacity-100 scale-100"
                }`}
                size={16}
              />

              <LuCopyCheck
                className={`absolute transition-all duration-300 text-green-500 ${
                  copiado ? "opacity-100 scale-100" : "opacity-0 scale-75"
                }`}
                size={16}
              />
            </span>
          </button>
        )}
      </div>

      {turno7?.fecha && turno11?.fecha && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div className="flex flex-col bg-white/50 rounded-xl p-3 border border-slate-200/60">
            <span className="text-xs text-primary">Villa Luro</span>
            <span className="font-semibold text-slate-800">
              {turno7.fecha} - {turno7.hora}
            </span>
          </div>

          <div className="flex flex-col bg-white/50 rounded-xl p-3 border border-slate-200/60">
            <span className="text-xs text-primary">Belgrano</span>
            <span className="font-semibold text-slate-800">
              {turno11.fecha} - {turno11.hora}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export { ProximoTurno };
