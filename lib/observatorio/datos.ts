
export const metadatos = {
  cobertura: "Colombia",
  periodo: "2025–2026",
  ultimaRevision: "25 de noviembre de 2026",
  nota: "Los indicadores conservan su fuente, periodo y unidad de observación.",
};

export const poblacionNNA = {
  indicador: "POB_NNA_001",
  nombre: "Población residente de 0 a 17 años",
  fuente: "DANE",
  unidad: "Personas estimadas",
  datos: [
    { anio: 2025, valor: 14330423 },
    { anio: 2026, valor: 14162508 },
  ],
};

export const poblacionEscolar = {
  indicador: "POB_ESC_001",
  nombre: "Población residente de 5 a 17 años",
  fuente: "DANE",
  unidad: "Personas estimadas",
  datos: [
    { anio: 2025, valor: 10642213 },
    { anio: 2026, valor: 10525981 },
  ],
};

export const matriculaSIMAT = {
  indicador: "EDU_NNA_001",
  nombre: "Matrícula reportada de 5 a 17 años",
  fuente: "MEN – SIMAT",
  anio: 2025,
  valor: 8496219,
  unidad: "Registros de matrícula",
  observacion:
    "El total corresponde a registros reportados. No se ha verificado que equivalga a estudiantes únicos.",
  registrosConTerritorioSinResolver: 6073,
};

export const matriculaSIMATPreliminar2026 = {
  indicador: "EDU_NNA_002",
  nombre: "Matrícula preliminar total del sistema educativo",
  fuente: "MEN",
  anio: 2026,
  valor: 8357939,
  fechaCorte: "23 de febrero de 2026",
  unidad: "Estudiantes registrados",
  observacion:
    "Cifra preliminar comunicada por el Ministerio de Educación Nacional. Corresponde al total del sistema educativo y no está desagregada por edades de 5 a 17 años. No es directamente comparable con la matrícula SIMAT 2025 presentada en este observatorio.",
};

export const relacionSIMATDANE = {
  indicador: "COB_NNA_001",
  nombre: "Relación descriptiva matrícula / población escolar",
  anio: 2025,
  numerador: 8496219,
  denominador: 10642213,
  porcentaje: 79.84,
  diferenciaAritmetica: 2145994,
  observacion:
    "No representa una tasa oficial de cobertura ni permite estimar directamente la desescolarización.",
};

export const victimasFiscalia = {
  indicador: "FGN_NNA_001",
  nombre: "Víctimas NNA según año de ocurrencia",
  fuente: "Fiscalía General de la Nación – Víctimas V3",
  unidad: "IDs anonimizados distintos por año",
  ultimoCorte: "31 de octubre de 2026",
  ultimoMesOcurrenciaConfirmado: "Octubre de 2026",
  datos: [
    { anio: 2025, registros: 149136, victimasDistintas: 145826 },
    { anio: 2026, registros: 99859, victimasDistintas: 98654 },
  ],
  observacion:
    "El conteo corresponde a IDs anonimizados distintos dentro de cada año, no necesariamente a personas únicas entre años. 2026 es un periodo parcial.",
};

export const policiaNNA = {
  fuente: "Policía Nacional – Niños, niñas y adolescentes víctimas de delitos",
  conjuntoDatos: "8mcu-22np",
  periodo: "1 de enero al 29 de junio de 2026",
  totalRegistros: 37849,
  unidad: "Registros",
  entornoVirtual: {
    indicador: "POL_NNA_DIG_001",
    nombre: "Registros clasificados en red virtual o internet",
    valor: 84,
    unidad: "Registros",
  },
  delitosEnEntornoVirtual: [
    { delito: "Artículo 246 – Estafa", registros: 24 },
    { delito: "Artículo 218 – Pornografía con menores", registros: 13 },
    { delito: "Artículo 269F – Violación de datos personales", registros: 10 },
    { delito: "Artículo 226 – Injuria por vías de hecho", registros: 7 },
    { delito: "Artículo 347 – Amenazas", registros: 7 },
    { delito: "Artículo 269A – Acceso abusivo a sistema informático", registros: 4 },
    { delito: "Artículo 269G – Suplantación de sitios web", registros: 3 },
    { delito: "Artículo 220 – Injuria", registros: 3 },
    { delito: "Artículo 269I – Hurto por medios informáticos", registros: 2 },
    { delito: "Artículo 221 – Calumnia", registros: 2 },
    { delito: "Artículo 209 – Actos sexuales con menor de 14 años", registros: 2 },
    { delito: "Artículo 269C – Interceptación de datos informáticos", registros: 2 },
    { delito: "Artículo 229 – Violencia intrafamiliar", registros: 1 },
    { delito: "Artículo 219A – Utilización de medios de comunicación para ofrecer servicios sexuales de menores", registros: 1 },
    { delito: "Artículo 296 – Falsedad personal", registros: 1 },
    { delito: "Artículo 269D – Daño informático", registros: 1 },
    { delito: "Artículo 182 – Constreñimiento ilegal", registros: 1 },
  ],
  delitosInformaticosSeleccionadosTotal: 339,
  delitosInformaticosEnEntornoVirtual: 22,
  observacion:
    "La clasificación RED VIRTUAL O INTERNET identifica el lugar o entorno reportado. Los registros no equivalen a víctimas únicas. La naturaleza informática de un delito no demuestra por sí sola que el hecho se originó en internet.",
};

export const caiVirtual = {
  fuente: "CAI Virtual – Centro Cibernético Policial",
  incidentesNNA: {
    anio: 2025,
    valor: 148,
    periodo: "1 de enero al 16 de mayo de 2025",
    unidad: "Incidentes gestionados",
  },
  denunciasComparables: {
    periodo: "1 de enero al 16 de mayo",
    datos: [
      { anio: 2024, articulo218: 404, articulo219A: 44, total: 448 },
      { anio: 2025, articulo218: 319, articulo219A: 40, total: 359 },
    ],
    observacion:
      "Cifras de SIEDCO Plus V2.0 publicadas en el boletín CAI Virtual de la semana 20 de 2025. No equivalen al número de incidentes gestionados.",
  },
  tipologias: [
    "Grooming",
    "Ciberbullying",
    "Sextorsión",
    "Ciberacoso",
    "Explotación y abuso sexual en línea",
    "Publicación de imágenes o videos con material de abuso sexual infantil",
  ],
  observacion:
    "El boletín no desagrega los 148 incidentes por tipología. No se deben distribuir cifras entre estas modalidades.",
};
