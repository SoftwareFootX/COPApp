import { useEffect, useState } from "react";
import { useAdminTurnos } from "../../../../../features/turnos/hooks/turnos/useAdminTurnos";
// import { Pagination } from "../../../../../app/components/Paginacion";
import { FiEdit, FiTrash2, FiCheck, FiX } from "react-icons/fi";
import { useAuthStore } from "../../../../../app/store/useStore";

const Historial = ({ modo }: { modo: string }) => {
  const { user } = useAuthStore();
  const {
    bloqueosData,
    feriadosData,
    // totalPaginas,
    containerRef,
    formFeriados,
    formBloqueos,
    loading,
    pagina,

    eliminarBloqueoTurno,
    eliminarFeriadoTurno,
    editarBloqueoTurno,
    editarFeriadoTurno,
    setFormBloqueos,
    setFormFeriados,
    turnosBloqueados,
    // setPagina,
    feriados,
  } = useAdminTurnos();

  const [editId, setEditId] = useState<number | null>(null);

  useEffect(() => {
    modo === "bloqueo" ? turnosBloqueados(pagina) : feriados(pagina);
  }, [pagina, modo]);

  const getTipoDeturno = (tipo: number) => {
    switch (tipo) {
      case 0:
        return "Horario";
      case 1:
        return "Completo";
      case 2:
        return "Mañana";
      case 3:
        return "Tarde";
      default:
        return "Otro";
    }
  };

  const bloqueosAgrupados = Object.values(
    bloqueosData.reduce((acc: any, item) => {
      const id = item.idtturnos_bloqueados;

      if (!acc[id]) {
        acc[id] = {
          ...item,
          cantidadConsultorios: 0,
          consultoriosDescripcion: [],
        };
      }

      if (item.idtespacios_turnos_bloqueados) {
        acc[id].cantidadConsultorios++;

        if (item.espt_descripcion) {
          acc[id].consultoriosDescripcion.push(
            item.espt_descripcion.split(" ")[0],
          );
        }
      }

      return acc;
    }, {}),
  )
    .map((item: any) => ({
      ...item,
      consultoriosDescripcion: item.consultoriosDescripcion.join(", "),
    }))
    .sort(
      (a: any, b: any) =>
        new Date(b.turno_bloq_fecha).getTime() -
        new Date(a.turno_bloq_fecha).getTime(),
    )
    .filter((item: any) => item.is_deleted === 0);

  return (
    <div ref={containerRef} className="w-full h-full py-5 min-h-80 px-2">
      <div className="shadow-xl rounded-2xl overflow-x-auto w-full">
        <div className="min-w-215">
          {modo === "bloqueo" ? (
            <div className="grid grid-cols-12 gap-4 px-4 py-3 text-xs font-medium text-white uppercase border-b bg-primary">
              <div className="col-span-2 text-center">Sede</div>
              <div className="col-span-2 text-center">Fecha</div>
              <div className="col-span-2 text-center">Tipo</div>
              <div className="col-span-2 text-center">Consultorios</div>
              <div className="col-span-3 text-center">Descripción</div>
              <div className="col-span-1 text-center">Acciones</div>
            </div>
          ) : (
            <div className="grid grid-cols-3 gap-4 px-4 py-3 text-xs font-medium text-white uppercase border-b bg-primary">
              <div className="col-span-1 text-center">Fecha</div>
              <div className="col-span-1 text-center">Feriado Fijo</div>
              <div className="col-span-1 text-center">Acciones</div>
            </div>
          )}

          <div className="divide-y">
            {modo === "bloqueo" &&
              bloqueosAgrupados?.map((item: any) => (
                <div
                  key={item.idtturnos_bloqueados}
                  className="grid grid-cols-12 gap-4 px-4 py-4 items-center odd:bg-white hover:bg-gray-100 transition"
                >
                  <div className="col-span-2 text-sm text-center">
                    {item.fk_cede === 7 ? "Villa Luro" : "Belgrano"}
                  </div>

                  <div className="col-span-2 text-sm text-center">
                    {editId === item.idtturnos_bloqueados ? (
                      <input
                        type="date"
                        value={formBloqueos.fecha_turno_bloqueo}
                        onChange={(e) =>
                          setFormBloqueos({
                            ...formBloqueos,
                            fecha_turno_bloqueo: e.target.value,
                          })
                        }
                        className="border rounded px-2 py-1 h-10 cursor-pointer"
                      />
                    ) : (
                      new Date(item.turno_bloq_fecha).toLocaleDateString()
                    )}
                  </div>

                  {/* TIPO */}
                  <div className="col-span-2 text-sm text-center">
                    {editId === item.idtturnos_bloqueados ? (
                      <select
                        value={formBloqueos.turno_bloq_tipo}
                        onChange={(e) =>
                          setFormBloqueos({
                            ...formBloqueos,
                            turno_bloq_tipo: Number(e.target.value),
                          })
                        }
                        className="border rounded px-2 py-1 h-10 cursor-pointer"
                      >
                        <option value={1}>Todo el día</option>
                        <option value={2}>9h - 13h</option>
                        <option value={3}>14h - 18h</option>
                      </select>
                    ) : (
                      getTipoDeturno(item.turno_bloq_tipo)
                    )}
                  </div>

                  <div className="col-span-2 text-sm text-center">
                    {item.consultoriosDescripcion}
                  </div>

                  <div className="col-span-3 text-sm text-center">
                    {editId === item.idtturnos_bloqueados ? (
                      <input
                        type="text"
                        value={formBloqueos.turno_bloq_descripcion}
                        onChange={(e) =>
                          setFormBloqueos({
                            ...formBloqueos,
                            turno_bloq_descripcion: e.target.value,
                          })
                        }
                        className="border rounded px-2 py-1 w-full h-10 cursor-pointer"
                      />
                    ) : (
                      item.turno_bloq_descripcion || "---"
                    )}
                  </div>

                  {/* ACCIONES */}
                  <div className="col-span-1 flex justify-center gap-4">
                    {editId === item.idtturnos_bloqueados ? (
                      <>
                        <FiCheck
                          className="cursor-pointer text-green-600"
                          onClick={() => {
                            editarBloqueoTurno();
                            setEditId(null);
                          }}
                        />

                        <FiX
                          className="cursor-pointer text-red-500"
                          onClick={() => setEditId(null)}
                        />
                      </>
                    ) : (
                      <>
                        <FiEdit
                          className="cursor-pointer"
                          onClick={() => {
                            setEditId(item.idtturnos_bloqueados);

                            setFormBloqueos({
                              idtturnos_bloqueados: item.idtturnos_bloqueados,
                              fk_sede: item.fk_cede,
                              fecha_turno_bloqueo:
                                item.turno_bloq_fecha.split("T")[0],
                              turno_bloq_descripcion:
                                item.turno_bloq_descripcion,
                              turno_bloq_tipo: item.turno_bloq_tipo,
                              fk_usuarios: user?.idtusuarios!,
                            });
                          }}
                        />

                        <FiTrash2
                          className="cursor-pointer text-red-500"
                          onClick={() =>
                            eliminarBloqueoTurno(item.idtturnos_bloqueados)
                          }
                        />
                      </>
                    )}
                  </div>
                </div>
              ))}

            {modo === "feriado" &&
              feriadosData?.map((item) => (
                <div
                  key={item.idtferiados_turnos}
                  className="grid grid-cols-3 gap-4 px-4 py-4 items-center odd:bg-white hover:bg-gray-100 transition"
                >
                  <div className="text-center text-sm">
                    {editId === item.idtferiados_turnos ? (
                      <input
                        type="date"
                        value={formFeriados.feriado_fecha}
                        onChange={(e) =>
                          setFormFeriados({
                            ...formFeriados,
                            feriado_fecha: e.target.value,
                          })
                        }
                        className="border rounded px-2 py-1 h-10 cursor-pointer"
                      />
                    ) : (
                      new Date(item.feriado_fecha).toLocaleDateString()
                    )}
                  </div>

                  <div className="text-center text-sm">
                    {editId === item.idtferiados_turnos ? (
                      <select
                        value={formFeriados.feriado_fijo}
                        onChange={(e) =>
                          setFormFeriados({
                            ...formFeriados,
                            feriado_fijo: Number(e.target.value),
                          })
                        }
                        className="border rounded px-2 py-1 h-10 cursor-pointer"
                      >
                        <option value={1}>Sí</option>
                        <option value={0}>No</option>
                      </select>
                    ) : item.feriado_fijo.data[0] === 1 ? (
                      "Sí"
                    ) : (
                      "No"
                    )}
                  </div>

                  <div className="flex justify-center gap-2">
                    {editId === item.idtferiados_turnos ? (
                      <>
                        <FiCheck
                          className="cursor-pointer text-green-600"
                          onClick={() => {
                            editarFeriadoTurno();
                            setEditId(null);
                          }}
                        />

                        <FiX
                          className="cursor-pointer text-red-500"
                          onClick={() => setEditId(null)}
                        />
                      </>
                    ) : (
                      <>
                        <FiEdit
                          className="cursor-pointer"
                          onClick={() => {
                            setEditId(item.idtferiados_turnos);

                            setFormFeriados({
                              ...formFeriados,
                              idtferiados_turnos: item.idtferiados_turnos,
                              feriado_fecha: item.feriado_fecha.split("T")[0],
                              feriado_fijo: item.feriado_fijo.data[0],
                            });
                          }}
                        />

                        <FiTrash2
                          className="cursor-pointer text-red-500"
                          onClick={() =>
                            eliminarFeriadoTurno(item.idtferiados_turnos)
                          }
                        />
                      </>
                    )}
                  </div>
                </div>
              ))}
          </div>

          {!loading &&
            ((modo === "bloqueo" && bloqueosData?.length === 0) ||
              (modo === "feriado" && feriadosData?.length === 0)) && (
              <div className="p-6 text-center text-sm text-gray-500">
                No hay registros
              </div>
            )}
        </div>
      </div>

      {/* {bloqueosData.length !== 0 && !loading && (
        <Pagination
          currentPage={pagina}
          totalPages={totalPaginas}
          onPageChange={async (page) => {
            setPagina(page);
          }}
        />
      )} */}
    </div>
  );
};

export { Historial };
