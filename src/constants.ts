/**
 * Algoritmo de retencion:
 * 2019: https://www.agenciatributaria.es/static_files/AEAT/Contenidos_Comunes/La_Agencia_Tributaria/Informacion_institucional/Campanias/Retenciones_trabajo_personal/2019/ALGORITMO_2019.pdf
 * 2020: https://www.agenciatributaria.es/static_files/Sede/Programas_ayuda/Retenciones/2020/ALGORITMO_RETENCIONES_2020.pdf
 * 2021: https://www.agenciatributaria.es/static_files/Sede/Programas_ayuda/Retenciones/2021/ALGORITMO_2021_LPGE.pdf
 */

/*
  * Cálculo de rendimiento neto
  * https://www.agenciatributaria.es/AEAT.internet/Inicio/Ayuda/Manuales__Folletos_y_Videos/Manuales_practicos/_Ayuda_Folleto_Actividades_economicas/3__Impuesto_sobre_la_Renta_de_las_Personas_Fisicas/3_4_Estimacion_directa_normal/3_4_2__Calculo_del_rendimiento_neto/3_4_2__Calculo_del_rendimiento_neto.html
  */
export const reduccionesRendimientoNeto = {
  comun: 2000,
  adicional: 3700,
  min: 11250,
  max: 14450,
  coeficiente: 1.15625,
  discapacidad33Al65: 3500,
  discapacidadMayor65: 7750,
  familiaNumerosa: 600
};

/*
  * Mínimo personal, familiar, por discapacidad, por ascendientes y descendientes:
  * https://www.agenciatributaria.es/AEAT.internet/Inicio/_Segmentos_/Ciudadanos/Discapacitados/Minimo_personal__familiar_y_por_discapacidad.shtml
  */
export const minimoPersonal = {
  normal: 5550,
  mayor75: 1400,
  mayor65: 1150
};

/**
 * Cuantías aplicables por el número de hijos:
 * https://www.agenciatributaria.es/AEAT.internet/Inicio/_Segmentos_/Ciudadanos/Minimos__reducciones_y_deducciones_en_el_IRPF/Minimos/Minimo_por_descendientes/Cuantias_aplicables.shtml
 */
export const minimoDescendientes = {
  menoresDe3: 2800,
  primerHijo: 2400,
  segundoHijo: 2700,
  tercerHijo: 4000,
  masHijos: 4500
};
export const minimoAscendientes = {
  mayor65: 1150,
  mayor75: 1400
};
export const discapacidad = {
  de33a65: 3000,
  masDe65: 12000
};
export const combos = {
  estadoCivil: [
    { id: '1', text: 'Viudo/a' },
    { id: '2', text: 'Soltero/a' },
    { id: '3', text: 'Divorciado/a' },
    { id: '4', text: 'Separado/a legalmente' },
    { id: '5', text: 'Casado/a' }
  ],
  situacionFamiliar: [
    {
      id: 'A',
      text: 'A: Contribuyente viudo, divorciado, separado legalmente o soltero, con hijos menores de 18 años o mayores incapacitados sujetos a patria potestad con convivan exclusivamente con él.'
    },
    {
      id: 'B',
      text: 'B: Contribuyente con cónyuge a cargo es aquel, que estando casado y no separado legalmente, su cónyuge no obtiene rentas anuales superiores a 1.500 euros, incluidas las exentas.'
    },
    {
      id: 'C',
      text: 'C: Contribuyente que no se encuentran en ninguno de los casos anteriores.'
    }
  ],
  /**
   * Base de cotizaciones a la seguridad social por tipo de contrato y categoría profesional:
   * http://www.seg-social.es/wps/portal/wss/internet/Trabajadores/CotizacionRecaudacionTrabajadores/36537
   */
  tipoContrato: [
    {
      id: 'general',
      text: 'General',
      cotizacion: 0.0635 // 4,70% + 0,10% + 1,55%
    },
    {
      id: 'temporal',
      text: 'Inferior a 12 meses',
      cotizacion: 0.0640 // 4,70% + 0,10% + 1,60%
    }
  ],
  categoriaProfesional: [
    {
      id: 'A',
      text: 'Ingenieros y Licenciados',
      min: 1466.5,
      max: 4070.1
    },
    {
      id: 'B',
      text: 'Ingenieros Técnicos, Peritos y Ayudantes Titulados',
      min: 1216,
      max: 4070.1
    },
    {
      id: 'C',
      text: 'Jefes Administrativos y de Taller',
      min: 1057.77,
      max: 4070.1
    },
    {
      id: 'D',
      text: 'Ayudantes no Titulados',
      min: 1049.95,
      max: 4070.1
    },
    {
      id: 'E',
      text: 'Oficiales Administrativos',
      min: 1049.95,
      max: 4070.1
    },
    {
      id: 'F',
      text: 'Subalternos',
      min: 1049.95,
      max: 4070.1
    },
    {
      id: 'G',
      text: 'Auxiliares Administrativos',
      min: 1049.95,
      max: 4070.1
    },
    {
      id: 'H',
      text: 'Oficiales de primera y segunda',
      min: 1049.95,
      max: 4070.1
    },
    {
      id: 'I',
      text: 'Oficiales de tercera y Especialistas',
      min: 1049.95,
      max: 4070.1
    },
    {
      id: 'J',
      text: 'Peones',
      min: 1049.95,
      max: 4070.1
    },
    {
      id: 'K',
      text: 'Trabajadores menores de dieciocho años, cualquiera',
      min: 1049.95,
      max: 4070.1
    }
  ]
};
export const minimoSituacionFamiliar: any = {
  A: [
    {
      minHijosMenor25: 0,
      maxHijosMenor25: 0,
      minimo: 0
    },
    {
      minHijosMenor25: 1,
      maxHijosMenor25: 1,
      minimo: 14266
    },
    {
      minHijosMenor25: 2,
      maxHijosMenor25: Infinity,
      minimo: 15803
    },
  ],
  B: [
    {
      minHijosMenor25: 0,
      maxHijosMenor25: 0,
      minimo: 13696
    },
    {
      minHijosMenor25: 1,
      maxHijosMenor25: 1,
      minimo: 14985
    },
    {
      minHijosMenor25: 2,
      maxHijosMenor25: Infinity,
      minimo: 17138
    },
  ],
  C: [
    {
      minHijosMenor25: 0,
      maxHijosMenor25: 0,
      minimo: 12000
    },
    {
      minHijosMenor25: 1,
      maxHijosMenor25: 1,
      minimo: 12607
    },
    {
      minHijosMenor25: 2,
      maxHijosMenor25: Infinity,
      minimo: 13275
    },
  ]
};

/**
 * Retenciones del rendimiento de trabajo:
 * https://www.agenciatributaria.es/AEAT.internet/Inicio/_Segmentos_/Ciudadanos/Retenciones_a_cuenta_del_IRPF/_Que_rentas_estan_sometidas_a_retencion_o_ingreso_a_cuenta_/Rendimientos_de_trabajo.shtml
 */
export const tramosRetenciones = [
  {
    min: 0,
    max: 12450,
    cuota: 0,
    porcentaje: 0.19,
  },
  {
    min: 12450,
    max: 20200,
    cuota: 2365.50,
    porcentaje: 0.24
  },
  {
    min: 20200,
    max: 35200,
    cuota: 4225.50,
    porcentaje: 0.30
  },
  {
    min: 35200,
    max: 60000,
    cuota: 8725.50,
    porcentaje: 0.37
  },
  {
    min: 60000,
    max: 300000,
    cuota: 17901.50,
    porcentaje: 0.45
  },
  {
    min: 300000,
    max: Infinity,
    cuota: 125901.50,
    porcentaje: 0.47
  }
];

// En algunas campañas ha habido deducciones de 400 euros "by the face"
export const deduccionEspecial = 0;