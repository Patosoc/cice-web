
"use client";

import { useMemo, useState } from "react";
import {
  Activity,
  BookOpenCheck,
  CalendarDays,
  Database,
  Globe2,
  Info,
  LockKeyhole,
  RefreshCw,
  ShieldAlert,
  Filter,
} from "lucide-react";

import {
  metadatos,
  poblacionNNA,
  poblacionEscolar,
  matriculaSIMAT,
  matriculaSIMATPreliminar2026,
  relacionSIMATDANE,
  victimasFiscalia,
  policiaNNA,
  caiVirtual,
} from "@/lib/observatorio/datos";

const fuentes = [
  "Todas las fuentes",
  "DANE – Población",
  "MEN – SIMAT",
  "Fiscalía – Víctimas V3",
  "Policía Nacional – NNA",
  "CAI Virtual – Centro Cibernético",
];

const riesgos = [
  "Todas las modalidades",
  ...caiVirtual.tipologias,
];

const formato = (valor: number) =>
  new Intl.NumberFormat("es-CO").format(valor);

function EstadoSinDatos({ mensaje }: { mensaje: string }) {
  return (
    <div className="flex min-h-32 flex-col items-center justify-center rounded-xl border border-dashed border-slate-300 bg-slate-50 px-5 py-7 text-center">
      <Database className="mb-2 h-7 w-7 text-slate-400" />
      <p className="text-sm font-semibold text-slate-600">
        Sin información disponible para este periodo
      </p>
      <p className="mt-1 max-w-md text-xs leading-5 text-slate-500">
        {mensaje}
      </p>
    </div>
  );
}

function TarjetaIndicador({
  titulo,
  valor,
  descripcion,
  color = "blue",
}: {
  titulo: string;
  valor: string;
  descripcion: string;
  color?: "blue" | "green" | "violet" | "amber";
}) {
  const fondos = {
    blue: "bg-blue-50 text-blue-700",
    green: "bg-emerald-50 text-emerald-700",
    violet: "bg-violet-50 text-violet-700",
    amber: "bg-amber-50 text-amber-700",
  };

  const sinDatos = valor === "Sin información disponible";

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className={`mb-4 inline-flex rounded-xl p-3 ${fondos[color]}`}>
        <Activity className="h-5 w-5" />
      </div>

      <p className="text-sm font-semibold text-slate-700">{titulo}</p>

      <p
        className={`mt-2 font-bold tracking-tight ${
          sinDatos
            ? "text-base text-slate-400"
            : "text-2xl text-slate-900"
        }`}
      >
        {valor}
      </p>

      <p className="mt-2 text-xs leading-5 text-slate-500">
        {descripcion}
      </p>
    </article>
  );
}

function GraficoBarras({
  titulo,
  descripcion,
  datos,
  color = "bg-blue-600",
}: {
  titulo: string;
  descripcion: string;
  datos: { etiqueta: string; valor: number }[];
  color?: string;
}) {
  const maximo = Math.max(...datos.map((d) => d.valor), 1);

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
      <div className="mb-6">
        <h3 className="font-bold text-slate-900">{titulo}</h3>
        <p className="mt-1 text-xs leading-5 text-slate-500">
          {descripcion}
        </p>
      </div>

      {datos.length > 0 ? (
        <div className="space-y-4">
          {datos.map((dato) => (
            <div key={dato.etiqueta}>
              <div className="mb-1.5 flex items-center justify-between gap-3 text-xs">
                <span className="font-medium text-slate-600">
                  {dato.etiqueta}
                </span>
                <span className="font-semibold tabular-nums text-slate-800">
                  {formato(dato.valor)}
                </span>
              </div>

              <div className="h-3 overflow-hidden rounded-full bg-slate-100">
                <div
                  className={`h-full rounded-full ${color}`}
                  style={{
                    width: `${Math.max((dato.valor / maximo) * 100, 1)}%`,
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <EstadoSinDatos mensaje="No existen registros para el año seleccionado." />
      )}
    </article>
  );
}

function TablaDelitos() {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[540px] text-left text-sm">
        <thead>
          <tr className="border-b border-slate-200 text-xs uppercase tracking-wide text-slate-500">
            <th className="px-3 py-3 font-semibold">
              Delito registrado
            </th>
            <th className="px-3 py-3 text-right font-semibold">
              Registros
            </th>
          </tr>
        </thead>

        <tbody>
          {policiaNNA.delitosEnEntornoVirtual.map((item) => (
            <tr key={item.delito} className="border-b border-slate-100">
              <td className="px-3 py-3 text-slate-700">
                {item.delito}
              </td>
              <td className="px-3 py-3 text-right font-semibold tabular-nums text-slate-900">
                {formato(item.registros)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default function DashboardCICE() {
  const [anio, setAnio] = useState("2025");
  const [fuente, setFuente] = useState("Todas las fuentes");
  const [riesgo, setRiesgo] = useState("Todas las modalidades");

  const anioSeleccionado = Number(anio);
  const es2025 = anioSeleccionado === 2025;
  const es2026 = anioSeleccionado === 2026;

  const mostrar = (nombre: string) =>
    fuente === "Todas las fuentes" || fuente === nombre;

  const datosPoblacion = useMemo(
    () =>
      poblacionNNA.datos.filter(
        (item) => item.anio === anioSeleccionado
      ),
    [anioSeleccionado]
  );

  const datosPoblacionEscolar = useMemo(
    () =>
      poblacionEscolar.datos.filter(
        (item) => item.anio === anioSeleccionado
      ),
    [anioSeleccionado]
  );

  const datosVictimas = useMemo(
    () =>
      victimasFiscalia.datos.filter(
        (item) => item.anio === anioSeleccionado
      ),
    [anioSeleccionado]
  );

  const valorPoblacion = datosPoblacion[0]?.valor;
  const valorPoblacionEscolar = datosPoblacionEscolar[0]?.valor;
  const valorVictimas = datosVictimas[0]?.victimasDistintas;

  const valorMatricula2025 = es2025
    ? matriculaSIMAT.valor
    : undefined;

  const tipologiasVisibles =
    riesgo === "Todas las modalidades"
      ? caiVirtual.tipologias
      : caiVirtual.tipologias.filter((item) => item === riesgo);

  const indicadoresVisibles = [
    {
      visible: mostrar("DANE – Población"),
      titulo: "Población NNA",
      valor: valorPoblacion
        ? formato(valorPoblacion)
        : "Sin información disponible",
      descripcion: `DANE · Residentes de 0 a 17 años · ${anioSeleccionado}`,
      color: "blue" as const,
    },
    {
      visible: mostrar("DANE – Población"),
      titulo: "Población en edad escolar",
      valor: valorPoblacionEscolar
        ? formato(valorPoblacionEscolar)
        : "Sin información disponible",
      descripcion: `DANE · Residentes de 5 a 17 años · ${anioSeleccionado}`,
      color: "green" as const,
    },
    {
      visible: mostrar("MEN – SIMAT"),
      titulo: "Matrícula reportada de 5 a 17 años",
      valor: valorMatricula2025
        ? formato(valorMatricula2025)
        : "Sin información disponible",
      descripcion: es2025
        ? `MEN · SIMAT · ${matriculaSIMAT.anio} · Registros de matrícula de 5 a 17 años`
        : "MEN · No se dispone de matrícula desagregada para edades de 5 a 17 años en 2026",
      color: "violet" as const,
    },
    {
      visible: mostrar("MEN – SIMAT") && es2026,
      titulo: "Matrícula preliminar total del sistema",
      valor: formato(matriculaSIMATPreliminar2026.valor),
      descripcion: `MEN · Corte al ${matriculaSIMATPreliminar2026.fechaCorte} · Total del sistema educativo; no desagregado por edades`,
      color: "violet" as const,
    },
    {
      visible: mostrar("MEN – SIMAT") && es2025,
      titulo: "Relación SIMAT / DANE",
      valor: `${relacionSIMATDANE.porcentaje.toFixed(2).replace(".", ",")}%`,
      descripcion: "Relación descriptiva entre registros SIMAT de 5 a 17 años y población DANE de la misma edad. No es tasa oficial de cobertura.",
      color: "amber" as const,
    },
    {
      visible: mostrar("Fiscalía – Víctimas V3"),
      titulo: "Víctimas NNA registradas",
      valor: valorVictimas
        ? formato(valorVictimas)
        : "Sin información disponible",
      descripcion: `Fiscalía · IDs anonimizados distintos · ${anioSeleccionado}${
        es2026 ? " · Periodo parcial" : ""
      }`,
      color: "blue" as const,
    },
    {
      visible: mostrar("Policía Nacional – NNA"),
      titulo: "Registros en entorno virtual",
      valor: es2026
        ? formato(policiaNNA.entornoVirtual.valor)
        : "Sin información disponible",
      descripcion: es2026
        ? "Policía Nacional · 1 de enero al 29 de junio de 2026"
        : "Policía Nacional · Sin dato disponible para 2025",
      color: "violet" as const,
    },
    {
      visible: mostrar("CAI Virtual – Centro Cibernético"),
      titulo: "Incidentes gestionados",
      valor: es2025
        ? formato(caiVirtual.incidentesNNA.valor)
        : "Sin información disponible",
      descripcion: es2025
        ? "CAI Virtual · 1 de enero al 16 de mayo de 2025"
        : "CAI Virtual · Sin dato disponible para 2026",
      color: "green" as const,
    },
  ];

  const indicadoresFiltrados = indicadoresVisibles.filter(
    (item) => item.visible
  );

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800">
      <div className="mx-auto max-w-[1440px] px-4 py-6 sm:px-6 lg:px-8">

        <header className="overflow-hidden rounded-2xl border border-blue-100 bg-white shadow-sm">
          <div className="relative bg-gradient-to-r from-blue-950 via-blue-900 to-cyan-800 px-6 py-9 text-white md:px-10">
            <div className="absolute -right-12 -top-24 h-72 w-72 rounded-full border border-white/10" />
            <div className="absolute -right-2 -top-12 h-52 w-52 rounded-full border border-white/10" />

            <div className="relative z-10 flex flex-col justify-between gap-6 md:flex-row md:items-center">
              <div>
                <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.2em] text-cyan-200">
                  <ShieldAlert className="h-4 w-4" />
                  Centro de Innovación y Ciberseguridad Educativa
                </div>

                <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
                  Observatorio CICE
                </h1>

                <p className="mt-3 max-w-2xl text-sm leading-6 text-blue-100 md:text-base">
                  Observación y análisis de los riesgos digitales que afectan
                  a niños, niñas y adolescentes en Colombia.
                </p>
              </div>

              <div className="relative rounded-xl border border-white/20 bg-white/10 p-4 backdrop-blur-sm md:min-w-56">
                <div className="flex items-center gap-2 text-cyan-100">
                  <CalendarDays className="h-4 w-4" />
                  <span className="text-xs font-medium uppercase tracking-wider">
                    Período de observación
                  </span>
                </div>

                <p className="mt-2 text-2xl font-bold">
                  2025 – 2026
                </p>

                <p className="mt-1 text-xs text-blue-100">
                  Según disponibilidad de cada fuente
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 px-6 py-4 md:flex-row md:items-center md:justify-between md:px-10">
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <Globe2 className="h-4 w-4 text-blue-700" />
              Cobertura nacional · Colombia
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-2 rounded-full border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-800">
                <Info className="h-3.5 w-3.5" />
                Vista preliminar
              </span>

              <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs text-slate-600">
                <LockKeyhole className="h-3.5 w-3.5" />
                Acceso institucional previsto
              </span>
            </div>
          </div>
        </header>

        <section className="mt-6 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
          <div className="mb-5 flex items-center gap-2">
            <Filter className="h-5 w-5 text-blue-800" />
            <h2 className="font-bold text-slate-800">
              Filtros de consulta
            </h2>

            <span className="ml-auto text-xs text-slate-400">
              Datos integrados
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold text-slate-600">
                Año
              </span>

              <select
                value={anio}
                onChange={(e) => setAnio(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                <option value="2025">2025</option>
                <option value="2026">2026</option>
              </select>
            </label>

            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold text-slate-600">
                Fuente de información
              </span>

              <select
                value={fuente}
                onChange={(e) => setFuente(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                {fuentes.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>

            <label className="block">
              <span className="mb-1.5 block text-xs font-semibold text-slate-600">
                Modalidad de riesgo
              </span>

              <select
                value={riesgo}
                onChange={(e) => setRiesgo(e.target.value)}
                className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
              >
                {riesgos.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <p className="text-xs text-slate-500">
              Selección actual: {anio} · {fuente} · {riesgo}
            </p>

            <button
              type="button"
              onClick={() => {
                setAnio("2025");
                setFuente("Todas las fuentes");
                setRiesgo("Todas las modalidades");
              }}
              className="inline-flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-50"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              Limpiar filtros
            </button>
          </div>
        </section>

        <section className="mt-7">
          <div className="mb-4">
            <h2 className="text-lg font-bold text-slate-900">
              Indicadores generales · {anioSeleccionado}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Cifras oficiales y registros administrativos, presentados según
              su unidad de observación y disponibilidad para el año seleccionado.
            </p>
          </div>

          {indicadoresFiltrados.length > 0 ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {indicadoresFiltrados.map((item) => (
                <TarjetaIndicador
                  key={item.titulo}
                  titulo={item.titulo}
                  valor={item.valor}
                  descripcion={item.descripcion}
                  color={item.color}
                />
              ))}
            </div>
          ) : (
            <EstadoSinDatos mensaje="No hay indicadores para la fuente seleccionada." />
          )}
        </section>

        <section className="mt-7">
          <div className="mb-4">
            <h2 className="text-lg font-bold text-slate-900">
              Indicadores por año seleccionado
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Las gráficas muestran exclusivamente el año elegido en los filtros.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
            {mostrar("DANE – Población") && (
              <>
                <GraficoBarras
                  titulo="Población NNA"
                  descripcion={`DANE · Población residente de 0 a 17 años · ${anioSeleccionado}`}
                  datos={datosPoblacion.map((item) => ({
                    etiqueta: String(item.anio),
                    valor: item.valor,
                  }))}
                  color="bg-blue-600"
                />

                <GraficoBarras
                  titulo="Población en edad escolar"
                  descripcion={`DANE · Población residente de 5 a 17 años · ${anioSeleccionado}`}
                  datos={datosPoblacionEscolar.map((item) => ({
                    etiqueta: String(item.anio),
                    valor: item.valor,
                  }))}
                  color="bg-emerald-600"
                />
              </>
            )}

            {mostrar("Fiscalía – Víctimas V3") && (
              <GraficoBarras
                titulo="Víctimas NNA registradas"
                descripcion={`Fiscalía · IDs anonimizados distintos por año de ocurrencia · ${anioSeleccionado}. 2026 es parcial.`}
                datos={datosVictimas.map((item) => ({
                  etiqueta: String(item.anio),
                  valor: item.victimasDistintas,
                }))}
                color="bg-violet-600"
              />
            )}
          </div>
        </section>

        {mostrar("Policía Nacional – NNA") && (
          <section className="mt-7 grid grid-cols-1 gap-5 xl:grid-cols-2">
            {es2026 ? (
              <>
                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
                  <div className="mb-4 flex items-center gap-2">
                    <ShieldAlert className="h-5 w-5 text-blue-800" />

                    <div>
                      <h2 className="font-bold text-slate-900">
                        Registros en entorno virtual
                      </h2>

                      <p className="text-xs text-slate-500">
                        Policía Nacional · 2026
                      </p>
                    </div>
                  </div>

                  <p className="text-3xl font-bold text-slate-900">
                    {formato(policiaNNA.entornoVirtual.valor)}
                  </p>

                  <p className="mt-2 text-sm text-slate-600">
                    Registros clasificados como RED VIRTUAL O INTERNET,
                    dentro de {formato(policiaNNA.totalRegistros)} registros
                    del conjunto consultado.
                  </p>

                  <div className="mt-4 rounded-lg bg-slate-50 p-3 text-xs leading-5 text-slate-600">
                    {policiaNNA.observacion}
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
                  <h2 className="mb-1 font-bold text-slate-900">
                    Delitos registrados en entorno virtual
                  </h2>

                  <p className="mb-4 text-xs text-slate-500">
                    Desagregación de los 84 registros clasificados en ese entorno.
                  </p>

                  <TablaDelitos />

                  <p className="mt-3 text-xs text-slate-500">
                    Total de la desagregación: 84 registros.
                  </p>
                </div>
              </>
            ) : (
              <div className="xl:col-span-2">
                <EstadoSinDatos mensaje="Los registros de la Policía Nacional clasificados en el entorno RED VIRTUAL O INTERNET corresponden al periodo disponible de 2026. No se dispone de información equivalente para 2025." />
              </div>
            )}
          </section>
        )}

        {mostrar("CAI Virtual – Centro Cibernético") && (
          <section className="mt-7 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm md:p-6">
            <div className="mb-5 flex items-center gap-2">
              <Activity className="h-5 w-5 text-violet-700" />

              <div>
                <h2 className="font-bold text-slate-900">
                  Gestión institucional · CAI Virtual
                </h2>

                <p className="text-xs text-slate-500">
                  Incidentes gestionados y denuncias reportadas en boletines.
                </p>
              </div>
            </div>

            {es2025 ? (
              <>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div className="rounded-xl bg-violet-50 p-4">
                    <p className="text-xs text-violet-800">
                      Incidentes gestionados
                    </p>

                    <p className="mt-2 text-2xl font-bold text-violet-950">
                      {formato(caiVirtual.incidentesNNA.valor)}
                    </p>

                    <p className="mt-1 text-xs text-violet-800">
                      {caiVirtual.incidentesNNA.periodo}
                    </p>
                  </div>

                  {caiVirtual.denunciasComparables.datos
                    .filter((item) => item.anio === 2025)
                    .map((item) => (
                      <div
                        key={item.anio}
                        className="rounded-xl bg-slate-50 p-4"
                      >
                        <p className="text-xs text-slate-500">
                          Denuncias SIEDCO · {item.anio}
                        </p>

                        <p className="mt-2 text-2xl font-bold text-slate-900">
                          {formato(item.total)}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          Art. 218: {item.articulo218} · Art. 219A:{" "}
                          {item.articulo219A}
                        </p>
                      </div>
                    ))}
                </div>

                <div className="mt-5">
                  <h3 className="mb-3 text-sm font-bold text-slate-800">
                    Tipologías identificadas en los boletines
                  </h3>

                  <div className="flex flex-wrap gap-2">
                    {tipologiasVisibles.map((item) => (
                      <span
                        key={item}
                        className="rounded-full border border-violet-100 bg-violet-50 px-3 py-1.5 text-xs font-medium text-violet-800"
                      >
                        {item}
                      </span>
                    ))}

                    {tipologiasVisibles.length === 0 && (
                      <p className="text-xs text-slate-500">
                        No hay tipologías para el filtro seleccionado.
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-4 rounded-lg border border-amber-200 bg-amber-50 p-4 text-xs leading-5 text-amber-900">
                  <strong>Nota metodológica:</strong> Las tipologías no tienen
                  desagregación numérica individual en el boletín citado. Los
                  incidentes gestionados y las denuncias SIEDCO son unidades
                  diferentes y no deben sumarse. La cifra SIEDCO presentada
                  corresponde al periodo del 1 de enero al 16 de mayo de 2025.
                </div>
              </>
            ) : (
              <EstadoSinDatos mensaje="Los 148 incidentes gestionados por CAI Virtual corresponden al periodo del 1 de enero al 16 de mayo de 2025. No se dispone de una cifra comparable integrada para 2026." />
            )}
          </section>
        )}

        <section className="mt-7 rounded-2xl border border-blue-100 bg-blue-50/70 p-5 md:p-6">
          <div className="flex items-start gap-3">
            <div className="rounded-xl bg-white p-3 text-blue-800 shadow-sm">
              <BookOpenCheck className="h-5 w-5" />
            </div>

            <div className="min-w-0">
              <h2 className="font-bold text-blue-950">
                Fuentes, metodología y transparencia
              </h2>

              <p className="mt-2 text-sm leading-6 text-blue-900/80">
                El Observatorio CICE utiliza información pública del DANE,
                Ministerio de Educación Nacional, Fiscalía General de la Nación
                y Policía Nacional. Cada indicador conserva su fuente, periodo
                y unidad de observación. Las cifras de denuncias, procesos,
                víctimas, matrícula e incidentes no se consideran equivalentes.
              </p>

              <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {[
                  "DANE – Proyecciones de población",
                  "MEN – SIMAT",
                  "Fiscalía – Víctimas V3",
                  "Policía Nacional – NNA víctimas de delitos",
                  "CAI Virtual – Centro Cibernético Policial",
                ].map((nombre) => (
                  <div
                    key={nombre}
                    className="flex items-center gap-2 rounded-lg border border-blue-100 bg-white px-3 py-2.5 text-xs font-medium text-slate-700"
                  >
                    <Database className="h-4 w-4 shrink-0 text-blue-700" />
                    {nombre}
                  </div>
                ))}
              </div>

              <p className="mt-4 text-xs text-blue-900/70">
                Periodo de consulta: 2025–2026 · Última revisión de esta
                integración: {metadatos.ultimaRevision}.
              </p>
            </div>
          </div>
        </section>

        <footer className="mt-8 flex flex-col gap-2 border-t border-slate-200 py-5 text-xs text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>
            Observatorio CICE · Centro de Investigación en Ciberseguridad Educativa
          </p>

          <p className="flex items-center gap-1.5">
            <Info className="h-3.5 w-3.5" />
            Versión preliminar · Datos estadísticos integrados
          </p>
        </footer>
      </div>
    </div>
  );
}
