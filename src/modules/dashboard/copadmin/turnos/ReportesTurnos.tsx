import { useRef } from "react";

import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";
import { Doughnut } from "react-chartjs-2";
import html2canvas from "html2canvas";

import { CiImageOn } from "react-icons/ci";

import { useReportesTurnos } from "../../../../features/turnos/hooks/turnos/useReportesTurnos";
import { Spinner } from "../../../../app/components/Spinner";
import { ProximoTurno } from "./components/ProximoTurno";
import { Container } from "../../../../ui/components";
import {
  formatDate,
  HEX_COLORS,
} from "../../../../features/turnos/utils/utils";

ChartJS.register(ArcElement, Tooltip, Legend);

const ReportesTurnos = () => {
  const {
    reportesTurnos,
    setLoading,
    setFecha,
    setSedes,

    dataReporte,
    loading,
    fechas,
    sedes,
  } = useReportesTurnos();

  const reportRef = useRef<HTMLDivElement>(null);

  const total = dataReporte?.total?.[0];
  const detalles = dataReporte?.detalles || [];
  const detalles_inasistencias = dataReporte?.inasistencias || [];

  const exportarImagen = async () => {
    setLoading(true);
    if (!reportRef.current) return;

    const canvas = await html2canvas(reportRef.current, {
      backgroundColor: "#ffffff",
      scale: 2,
      onclone: (doc) => {
        const elements = doc.querySelectorAll("*");

        elements.forEach((el: any) => {
          const style = window.getComputedStyle(el);

          if (style.color.includes("oklch")) el.style.color = "#000";
          if (style.backgroundColor.includes("oklch"))
            el.style.backgroundColor = "#fff";
          if (style.borderColor.includes("oklch"))
            el.style.borderColor = "#e5e7eb";
        });
        setLoading(false);
      },
    });

    const link = document.createElement("a");
    link.download = "reporte_turnos.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  const chartEstados = {
    labels: ["Atendidos", "Inasistencias", "Cancelados"],
    datasets: [
      {
        data: [
          total?.atendidos || 0,
          total?.inasistencias || 0,
          total?.cancelados_sin_reprogramar || 0,
        ],
        backgroundColor: ["#22c55e", "#f59e0b", "#ef4444"],
        borderWidth: 0,
      },
    ],
  };

  const chartServicios = {
    labels: detalles.map((d: any) => d.serv_descripcion),
    datasets: [
      {
        data: detalles.map((d: any) => d.cantidad_atendidos),
        backgroundColor: [
          HEX_COLORS.ABEO,
          HEX_COLORS.ENTREGA,
          HEX_COLORS.REPITE,
          HEX_COLORS.CONTROL,
          HEX_COLORS.ORTESIS,
          HEX_COLORS.TECNICO_ASIGNADO,
          HEX_COLORS.SIN_ASIGNAR,
          HEX_COLORS.FL,
          HEX_COLORS.AP,
          HEX_COLORS.ENT_PEDILEN,
        ],
        borderWidth: 0,
      },
    ],
  };

  const totalServicios = detalles.reduce(
    (acc: number, item: any) => acc + item.cantidad_atendidos,
    0,
  );

  const chartServiciosInasistencias = {
    labels: detalles_inasistencias.map((d: any) => d.serv_descripcion),
    datasets: [
      {
        data: detalles_inasistencias.map((d: any) => d.cantidad_inasistencias),
        backgroundColor: [
          "#6366f1",
          "#22c55e",
          "#f59e0b",
          "#ef4444",
          "#06b6d4",
          "#a855f7",
        ],
        borderWidth: 0,
      },
    ],
  };

  const totalServiciosInasistencia = detalles_inasistencias.reduce(
    (acc: number, item: any) => acc + item.cantidad_inasistencias,
    0,
  );

  return (
    <Container>
      <div className="pt-2 sm:p-3 text-slate-900 flex flex-col h-auto w-full">
        <ProximoTurno />

        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 mb-4 flex flex-col lg:flex-row lg:items-end gap-4">
          <div className="flex flex-col w-full lg:w-48">
            <label className="text-xs text-slate-500 mb-1">Sede</label>
            <select
              value={sedes}
              onChange={(e) =>
                setSedes(
                  e.target.value as "Ambas sedes" | "Villa luro" | "Belgrano",
                )
              }
              className="bg-slate-50 border border-slate-200 rounded-lg p-2 cursor-pointer h-10"
            >
              <option>Ambas sedes</option>
              <option>Villa luro</option>
              <option>Belgrano</option>
            </select>
          </div>

          <div className="flex flex-col w-full lg:w-44">
            <label className="text-xs text-slate-500 mb-1">Desde</label>
            <input
              className="bg-slate-50 border border-slate-200 rounded-lg p-2 cursor-pointer h-10"
              type="date"
              value={fechas.fecha_a}
              onChange={(e) =>
                setFecha((prev) => ({ ...prev, fecha_a: e.target.value }))
              }
            />
          </div>

          <div className="flex flex-col w-full lg:w-44">
            <label className="text-xs text-slate-500 mb-1">Hasta</label>
            <input
              className="bg-slate-50 border border-slate-200 rounded-lg p-2 cursor-pointer h-10"
              type="date"
              value={fechas.fecha_b}
              onChange={(e) =>
                setFecha((prev) => ({ ...prev, fecha_b: e.target.value }))
              }
            />
          </div>

          <div className="flex gap-2 w-full lg:w-auto lg:ml-auto">
            <button
              onClick={reportesTurnos}
              disabled={loading}
              className={`${
                loading
                  ? "bg-primary/60"
                  : "bg-primary hover:bg-primary/90 cursor-pointer"
              } text-white rounded-lg px-4 py-2 w-full sm:w-36 transition`}
            >
              Buscar
            </button>

            <button
              onClick={exportarImagen}
              disabled={loading}
              className={`${
                loading
                  ? "bg-slate-800/60"
                  : "bg-slate-800 hover:bg-slate-700 cursor-pointer"
              } text-white rounded-lg py-1 sm:px-4 px-2 sm:py-2 w-full sm:w-36 transition flex justify-center items-center gap-2`}
            >
              <span>Exportar</span>
              <CiImageOn size={20} />
            </button>
          </div>
        </div>

        <main
          ref={reportRef}
          className="mx-auto w-full flex flex-col gap-1 sm:gap-4 p-2 sm:p-4"
        >
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-2 flex justify-center items-center gap-5">
            <span className="font-bold text-md text-center sm:text-lg">
              {total?.atendidos && total?.inasistencias && (
                <>
                  Total de turnos para el periodo {formatDate(fechas.fecha_a)}{" "}
                  <span className="text-primary">-</span>{" "}
                  {formatDate(fechas.fecha_b)}
                  {"  "}
                  <span className="text-primary">|</span> {sedes}
                </>
              )}

              {(!fechas.fecha_a ||
                !fechas.fecha_b ||
                !total?.atendidos ||
                !total?.inasistencias) && <>Ingrese fechas a consultar</>}
            </span>
            <Spinner loading={loading} />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-1 sm:gap-4">
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-2">
              <p className="text-sm text-gray-500">Atendidos</p>
              <p className="text-3xl font-bold text-green-600">
                {total?.atendidos || 0}
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-2">
              <p className="text-sm text-gray-500">Inasistencias</p>
              <p className="text-xl sm:text-3xl font-bold text-yellow-500">
                {total?.inasistencias || 0}
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-2">
              <div className="flex flex-col">
                <p className="text-sm text-gray-500">
                  Turnos totales{" "}
                  <span className="text-[10px]">
                    (Atendidos + inasistencias)
                  </span>
                </p>
              </div>
              <p className="text-xl sm:text-3xl font-bold text-blue-500">
                {total?.atendidos + total?.inasistencias || 0}
              </p>
            </div>

            <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-2">
              <p className="text-sm text-gray-500">
                Cancelados{" "}
                <span className="text-[10px]">(No reprogramaron)</span>
              </p>
              <p className="text-xl sm:text-3xl font-bold text-red-500">
                {total?.cancelados_sin_reprogramar || 0}
              </p>
            </div>
          </div>
          {dataReporte.total.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-1 sm:gap-4 my-0">
              <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-2 sm:p-4">
                <h3 className="font-semibold mb-3">Estado de Turnos</h3>

                <div className="flex flex-col sm:flex-row gap-4 items-center">
                  <div className="flex justify-center w-full sm:w-auto">
                    <div className="h-40 w-40 sm:h-52 sm:w-52">
                      <Doughnut
                        data={chartEstados}
                        options={{
                          plugins: {
                            legend: {
                              display: false,
                            },
                          },
                        }}
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-3 text-sm w-full">
                    {[
                      {
                        label: "Atendidos",
                        value: total?.atendidos || 0,
                        color: "#22c55e",
                      },
                      {
                        label: "Inasistencias",
                        value: total?.inasistencias || 0,
                        color: "#f59e0b",
                      },
                      {
                        label: "Cancelados",
                        value: total?.cancelados_sin_reprogramar || 0,
                        color: "#ef4444",
                      },
                    ].map((item, index) => {
                      const suma =
                        (total?.atendidos || 0) +
                        (total?.inasistencias || 0) +
                        (total?.cancelados_sin_reprogramar || 0);

                      const porcentaje = suma
                        ? Math.round((item.value * 100) / suma)
                        : 0;

                      return (
                        <div
                          key={index}
                          className="flex items-center justify-between bg-slate-50 rounded-lg px-3 py-2 gap-2"
                        >
                          <div className="flex items-center gap-2">
                            <span
                              className="w-3 h-3 rounded-full"
                              style={{ backgroundColor: item.color }}
                            />
                            <span className="text-gray-700">{item.label}</span>
                          </div>

                          <div className="flex gap-3 items-center">
                            <span className="font-semibold">{item.value}</span>
                            <span className="text-gray-500 text-xs">
                              {porcentaje}%
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-2 sm:p-4">
                <h3 className="font-semibold mb-3">Atenciones por Servicio</h3>

                <div className="flex flex-col sm:flex-row gap-4 items-center">
                  <div className="col-span-5 flex justify-center">
                    <div className="h-40 w-40 sm:h-52 sm:w-52">
                      <Doughnut
                        data={chartServicios}
                        options={{
                          plugins: {
                            legend: {
                              display: false,
                            },
                          },
                        }}
                      />
                    </div>
                  </div>

                  <div className="col-span-7 overflow-y-auto pr-2">
                    <div className="flex flex-col gap-2 text-sm">
                      {detalles.map((item: any, index: number) => {
                        const porcentaje = totalServicios
                          ? Math.round(
                              (item.cantidad_atendidos * 100) / totalServicios,
                            )
                          : 0;

                        return (
                          <div
                            key={item.idt_servicios_consul}
                            className="flex items-center justify-between bg-slate-50 rounded-lg px-3 py-2 gap-2"
                          >
                            <div className="flex items-center gap-2">
                              <span
                                className="w-3 h-3 rounded-full"
                                style={{
                                  backgroundColor:
                                    chartServicios.datasets[0].backgroundColor[
                                      index
                                    ],
                                }}
                              />

                              <span className="text-gray-700">
                                {item.serv_descripcion}
                              </span>
                            </div>

                            <div className="flex items-center gap-3">
                              <span className="font-semibold">
                                {item.cantidad_atendidos}
                              </span>

                              <span className="text-xs text-gray-500">
                                {porcentaje}%
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-2 sm:p-4">
                <h3 className="font-semibold mb-3">Detalle de inasistencias</h3>

                <div className="flex flex-col sm:flex-row gap-4 items-center">
                  <div className="col-span-5 flex justify-center">
                    <div className="h-40 w-40 sm:h-52 sm:w-52">
                      <Doughnut
                        data={chartServiciosInasistencias}
                        options={{
                          plugins: {
                            legend: {
                              display: false,
                            },
                          },
                        }}
                      />
                    </div>
                  </div>

                  <div className="col-span-7 overflow-y-auto pr-2">
                    <div className="flex flex-col gap-2 text-sm">
                      {detalles_inasistencias.map(
                        (item: any, index: number) => {
                          const porcentaje = totalServiciosInasistencia
                            ? Math.round(
                                (item.cantidad_inasistencias * 100) /
                                  totalServiciosInasistencia,
                              )
                            : 0;

                          return (
                            <div
                              key={item.idt_servicios_consul}
                              className="flex items-center justify-between bg-slate-50 rounded-lg px-3 py-2 gap-2"
                            >
                              <div className="flex items-center gap-2">
                                <span
                                  className="w-3 h-3 rounded-full"
                                  style={{
                                    backgroundColor:
                                      chartServiciosInasistencias.datasets[0]
                                        .backgroundColor[index],
                                  }}
                                />

                                <span className="text-gray-700">
                                  {item.serv_descripcion}
                                </span>
                              </div>

                              <div className="flex items-center gap-3">
                                <span className="font-semibold">
                                  {item.cantidad_inasistencias}
                                </span>

                                <span className="text-xs text-gray-500">
                                  {porcentaje}%
                                </span>
                              </div>
                            </div>
                          );
                        },
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </Container>
  );
};

export { ReportesTurnos };
