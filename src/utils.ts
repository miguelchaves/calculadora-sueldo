import * as constants from './constants';
import { Hijo, Ascendiente } from './class';

export function baseImponible(
  hijos: Array<Hijo>,
  brutoAnual: number,
  cuotaAcumuladaAnual: number,
  movilidadGeografica: boolean,
  esDiscapacitado: boolean,
  discapacidadMayorDe65: boolean
): number {
  const _hijosMenoresDe25 = hijosMenoresDe25(hijos);
  const familiaNumerosa = _hijosMenoresDe25 >= 3;

  const rendimientoNeto = brutoAnual - cuotaAcumuladaAnual;
  let reduccionRendimientoNeto = calcularReduccionRendimientoNeto(rendimientoNeto, movilidadGeografica, esDiscapacitado, discapacidadMayorDe65);
  if (familiaNumerosa) {
    reduccionRendimientoNeto += constants.reduccionesRendimientoNeto.familiaNumerosa;
  }
  let baseImponible = rendimientoNeto - reduccionRendimientoNeto;
  if (baseImponible < 0) {
    baseImponible = 0;
  }
  baseImponible = redondearDigitos(baseImponible);
  return baseImponible;
}

export function tipoSituacionFamiliar(estadoCivil: string, conyugeCobraMasDe1500: boolean, hijosMenoresDe25: number) : string {
  const estaCasado = estadoCivil === '5';
  let tipo;
  if (!estaCasado && hijosMenoresDe25 > 0) {
    tipo = 'A';
  } else if (estaCasado && !conyugeCobraMasDe1500) {
    tipo = 'B';
  } else  {
    tipo = 'C';
  }
  return tipo;
}

export function calcularCuotaMensual(brutoAnual: number, categoriaProfesional: string, tipoContrato: string) : number {
  const { min, max } = constants.combos.categoriaProfesional.find(cat => cat.id === categoriaProfesional) || constants.combos.categoriaProfesional[0];
  const { cotizacion } = constants.combos.tipoContrato.find(contrato => contrato.id === tipoContrato) || constants.combos.tipoContrato[0];
  const sueldoBrutoMensual = brutoAnual / 12;
  let cuotaMensual = sueldoBrutoMensual;
  if (sueldoBrutoMensual < min) {
    cuotaMensual = min;
  } else if (sueldoBrutoMensual > max) {
    cuotaMensual = max;
  }
  return cuotaMensual * cotizacion;
}

export function calcularReduccionRendimientoNeto(rendimientoNeto: number, movilidadGeografica: boolean, esDiscapacitado: boolean, discapacidadMayorDe65: boolean = false) : number {
  const { comun, adicional, min, max, coeficiente, discapacidad33Al65, discapacidadMayor65 } = constants.reduccionesRendimientoNeto;
  let reduccionRendimientoNeto = 0;
  if (rendimientoNeto < min) {
    reduccionRendimientoNeto = adicional;
  } else if (rendimientoNeto < max) {
    reduccionRendimientoNeto = adicional - coeficiente * (rendimientoNeto - min);
  }
  const incrementoMovilidad = movilidadGeografica ? reduccionRendimientoNeto : 0;
  let incrementoDiscapacidad = 0;
  if (esDiscapacitado && !discapacidadMayorDe65) {
    incrementoDiscapacidad = discapacidad33Al65;
  } else if (esDiscapacitado) {
    incrementoDiscapacidad = discapacidadMayor65;
  }
  const reduccionDesemplado = 0; // TODO: De momento no tenemos en cuenta esta variable
  const reduccionPensionista = 0; // TODO: De momento no tenemos en cuenta esta variable
  return comun + reduccionRendimientoNeto + incrementoMovilidad + incrementoDiscapacidad + reduccionDesemplado + reduccionPensionista;
}


export function calcularMinimo(
  edad: number,
  hijos: Array<Hijo>,
  hijosEnExclusividad: boolean,
  ascendientes: Array<Ascendiente>,
  personasDeduccionAscendientes: number,
  esDiscapacitado: boolean,
  discapacidadMayorDe65: boolean
): number {
  // Datos de entrada
  const _hijosMenoresDe3 = hijosMenoresDe3(hijos);
  const _hijosMenoresDe25 = hijosMenoresDe25(hijos);
  const _hijosDiscapacidad33Al65 = hijosDiscapacidad33Al65(hijos);
  const _hijosDiscapacidadMas65 = hijosDiscapacidadMas65(hijos);
  const _ascendenteMayor65Menor75 = ascendenteMayor65Menor75(ascendientes);
  const _ascendenteMayor75 = ascendenteMayor75(ascendientes);
  const _ascendientesDiscapacidad33Al65 = ascendientesDiscapacidad33Al65(ascendientes);
  const _ascendientesDiscapacidadMas65 = ascendientesDiscapacidadMas65(ascendientes);

  // Paso 1: Calcular mínimos
  const minimoPersonal = calcularMinimoPersonal(edad);
  const minimoHijosMenores25 = calcularMinimoHijosMenores25(_hijosMenoresDe25, hijosEnExclusividad);
  const minimoHijosMenores3 = calcularMinimoHijosMenores3(_hijosMenoresDe3, hijosEnExclusividad);
  const minimoAscendientesMayores65 = calcularMinimoAscendenteMayor65Menor75(_ascendenteMayor65Menor75, personasDeduccionAscendientes);
  const minimoAscendientesMayores75 = calcularMinimoAscendenteMayor75(_ascendenteMayor75, personasDeduccionAscendientes);
  const minimoDescendientesDiscapacitados = calculaMinimoDescendientesDiscapacitados(_hijosDiscapacidad33Al65, _hijosDiscapacidadMas65, hijosEnExclusividad);
  const minimoAscendientesDiscapacitados = calculaMinimoAscendientesDiscapacitados(_ascendientesDiscapacidad33Al65, _ascendientesDiscapacidadMas65, personasDeduccionAscendientes);
  const minimoDiscapacidad = calcularMinimoDiscapacidad(esDiscapacitado, discapacidadMayorDe65);
  let minimos = minimoPersonal +
    minimoHijosMenores25 +
    minimoHijosMenores3 +
    minimoAscendientesMayores65 +
    minimoAscendientesMayores75 +
    minimoDescendientesDiscapacitados +
    minimoAscendientesDiscapacitados +
    minimoDiscapacidad;
  minimos = redondearDigitos(minimos);
  return minimos;
}

export function calcularMinimoPersonal(edad: number): number {
  const { normal, mayor65, mayor75 } = constants.minimoPersonal;
  let acumulado = normal;
  if (edad >= 65) {
    acumulado += mayor65;
  }
  if (edad >= 75) { // Adicional a la suma de 65 años (no es un else)
    acumulado += mayor75;
  }
  return acumulado;
}

export function calcularMinimoHijosMenores25(hijosMenoresDe25: number, hijosEnExclusividad: boolean): number {
  const { primerHijo, segundoHijo, tercerHijo, masHijos } = constants.minimoDescendientes;
  let acumulado = 0;
  if (hijosMenoresDe25 >= 1) {
    acumulado += primerHijo;
  }
  if (hijosMenoresDe25 >= 2) {
    acumulado += segundoHijo;
  }
  if (hijosMenoresDe25 >= 3) {
    acumulado += tercerHijo;
  }
  if (hijosMenoresDe25 >= 4) {
    acumulado += (4 - hijosMenoresDe25) * masHijos;
  }
  return hijosEnExclusividad ? acumulado : acumulado / 2;
}

export function calcularMinimoHijosMenores3(hijosMenoresDe3: number, hijosEnExclusividad: boolean): number {
  const acumulado = hijosMenoresDe3 * constants.minimoDescendientes.menoresDe3;
  return hijosEnExclusividad ? acumulado : acumulado / 2;
}

export function calcularMinimoAscendenteMayor65Menor75(
  ascendenteMayor65Menor75: number,
  personasDeduccionAscendientes: number
): number {
  const { mayor65 } = constants.minimoAscendientes;
  const divisor = personasDeduccionAscendientes;
  return ascendenteMayor65Menor75 * mayor65 / divisor;
}

export function calcularMinimoAscendenteMayor75(
  ascendenteMayor75: number,
  personasDeduccionAscendientes: number
): number {
  const { mayor65, mayor75 } = constants.minimoAscendientes;
  const divisor = personasDeduccionAscendientes
  return ascendenteMayor75 * (mayor65 + mayor75) / divisor;
}

export function calculaMinimoDescendientesDiscapacitados(
  hijosDiscapacidad33Al65: number,
  hijosDiscapacidadMas65: number,
  hijosEnExclusividad: boolean
): number {
  const { de33a65, masDe65 } = constants.discapacidad;
  const resultado = hijosDiscapacidad33Al65 * de33a65 + hijosDiscapacidadMas65 * masDe65;
  return hijosEnExclusividad ? resultado : resultado / 2;
}

export function calculaMinimoAscendientesDiscapacitados(
  ascendientesDiscapacidad33Al65: number,
  ascendientesDiscapacidadMas65: number,
  personasDeduccionAscendientes: number
): number {
  const { de33a65, masDe65 } = constants.discapacidad;
  const divisor = personasDeduccionAscendientes + 1;
  const resultado = ascendientesDiscapacidad33Al65 * de33a65 + ascendientesDiscapacidadMas65 * masDe65;
  return resultado / divisor;
}

export function calcularMinimoDiscapacidad(
  esDiscapacitado: boolean,
  discapacidadMayorDe65: boolean = false
): number {
  const { de33a65, masDe65 } = constants.discapacidad;
  return esDiscapacitado && discapacidadMayorDe65 ? masDe65 : esDiscapacitado ? de33a65 : 0;
}

export function calcularCuotaBaseLiquidable(baseLiquidable: number): number {
  const tramo = constants.tramosRetenciones
    .find(tramo => tramo.min <= baseLiquidable && tramo.max > baseLiquidable) ||
    constants.tramosRetenciones[0];
  const retencion = tramo.cuota + (baseLiquidable - tramo.min) * tramo.porcentaje;
  return retencion;
}

export function calcularTipoRetencionSituacionFamiliar(
  tipoFinalRetencion: number,
  situacionFamiliar: any,
  hijosMenoresDe25: number,
  brutoAnual: number,
  tipoContrato: string
): number {
  const sinRetencion = 0;
  const minimiSituacionFamiliar = constants.minimoSituacionFamiliar[situacionFamiliar];
  const { minimo } = (minimiSituacionFamiliar || constants.minimoSituacionFamiliar.A).find((caso: { minHijosMenor25: number; maxHijosMenor25: number; }) =>
    caso.minHijosMenor25 <= hijosMenoresDe25 &&
    caso.maxHijosMenor25 >= hijosMenoresDe25
  );
  let tipoRetencion = brutoAnual < minimo ? sinRetencion : tipoFinalRetencion;
  if (tipoRetencion < 0) {
    tipoRetencion = 0;
  }
  // Correccion por el tipo de contrato laboral temporal
  if (tipoContrato === 'temporal' && tipoRetencion < 0.02) {
    tipoRetencion = 0.02;
  }
  return tipoRetencion;
}

//////////////////////////
// Funciones auxiliares //
//////////////////////////
export function hijosMenoresDe3 (hijos: Array<Hijo>): number {
  return hijos.filter(hijo => hijo.edad < 3).length;
}
/**
 * Todos los hijos menores de 25 años o discapacitados
 */
export function hijosMenoresDe25(hijos: Array<Hijo>): number {
  return hijos.filter(hijo => hijo.edad < 25 || hijo.esDiscapacitado).length;
}

export function hijosDiscapacidad33Al65(hijos: Array<Hijo>): number {
  return hijos.filter(hijo => hijo.esDiscapacitado && !hijo.discapacidadMayorDe65).length;
}

export function hijosDiscapacidadMas65(hijos: Array<Hijo>): number {
  return hijos.filter(hijo => hijo.esDiscapacitado && hijo.discapacidadMayorDe65).length;
}

/**
 * Ascendientes mayores de 65 años o discapacitados
 */
export function ascendenteMayor65Menor75(ascendientes: Array<Ascendiente>): number {
  return ascendientes.filter(asc => (asc.edad >= 65 || asc.esDiscapacitado) && asc.edad < 75).length;
}

export function ascendenteMayor75(ascendientes: Array<Ascendiente>): number {
  return ascendientes.filter(asc => asc.edad >= 75).length;
}

export function ascendientesDiscapacidad33Al65(ascendientes: Array<Ascendiente>): number {
  return ascendientes.filter(hijo => hijo.esDiscapacitado && !hijo.discapacidadMayorDe65).length;
}

export function ascendientesDiscapacidadMas65(ascendientes: Array<Ascendiente>): number {
  return ascendientes.filter(hijo => hijo.esDiscapacitado && hijo.discapacidadMayorDe65).length;
}

export const redondearDigitos = (num: number, decimales: number = 2) =>
  parseFloat(num.toFixed(decimales));

export const truncarDigitos = (num: number, decimales: number = 2):number =>
  Math.floor(num * Math.pow(10, decimales)) / Math.pow(10, decimales);