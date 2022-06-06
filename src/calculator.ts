class Persona {
  edad: number;
  esDiscapacitado: boolean;
  discapacidadMayorDe65: boolean;

  constructor(edad: number, esDiscapacitado: boolean = false, discapacidadMayorDe65: boolean = false) {
    this.edad = edad;
    this.esDiscapacitado = esDiscapacitado;
    this.discapacidadMayorDe65 = discapacidadMayorDe65;
  }
}

export class Hijo extends Persona {
  constructor(edad: number = 0, esDiscapacitado: boolean = false, discapacidadMayorDe65: boolean = false) {
    super(edad, esDiscapacitado, discapacidadMayorDe65);
  }
}

export class Ascendiente extends Persona {
  constructor(edad: number = 65, esDiscapacitado: boolean = false, discapacidadMayorDe65: boolean = false) {
    super(edad, esDiscapacitado, discapacidadMayorDe65);
  }
}

export interface SueldoNetoOutput {
  brutoAnual: number;
  netoAnual: number;
  netoMensual: number;
  tieneExtras: boolean;
  pagasExtras: number;
  retencionIRPF: number;
  tipoRetencionIRPF: number;
  cuotasSeguridadSocial: number;
}

export interface SueldoBrutoOutput extends SueldoNetoOutput {
  iteraciones: number;
}

import { combos, deduccionEspecial } from './constants';
import * as utils from './utils';

const validation = {
  brutoAnual: [
    {
      msg: 'El sueldo bruto anual debe ser mayor que cero',
      validator: (num: number) => num > 0
    }
  ],
  netoMensual: [
    {
      msg: 'El sueldo neto mensual debe ser mayor que cero',
      validator: (num: number) => num > 0
    }
  ],
  numeroPagas: [
    {
      msg: 'El número de pagas debe ser mayor que 12',
      validator: (num: number) => num >= 12
    }
  ],
  edad: [
    {
      msg: 'La edad debe ser mayor de 16 años',
      validator: (num: number) => num >= 16
    }
  ]
};

export class CalculadoraSueldo {
  brutoAnual: number;
  netoMensual: number;
  numeroPagas: number;
  edad: number;
  conyugeCobraMasDe1500: boolean;
  movilidadGeografica: boolean;
  esDiscapacitado: boolean;
  discapacidadMayorDe65: boolean;
  hijos: Array<Hijo>;
  hijosEnExclusividad: boolean;
  ascendientes: Array<Ascendiente>
  personasDeduccionAscendientes: number;
  tipoContrato: string;
  categoriaProfesional: string;
  estadoCivil: string;

  constructor(properties: any = {}) {
    this.brutoAnual = properties.brutoAnual || null;
    this.netoMensual = properties.netoMensual || null;
    this.numeroPagas = properties.numeroPagas || 12;
    this.edad = properties.edad || 30;
    this.conyugeCobraMasDe1500 = properties.conyugeCobraMasDe1500 || false;
    this.movilidadGeografica = properties.movilidadGeografica || false;
    this.esDiscapacitado = properties.esDiscapacitado || false;
    this.discapacidadMayorDe65 = properties.discapacidadMayorDe65 || false;
    this.hijos = properties.hijos || [];
    this.hijosEnExclusividad = properties.hijosEnExclusividad || false;
    this.ascendientes = properties.ascendientes || [];
    this.personasDeduccionAscendientes = properties.personasDeduccionAscendientes || 1;
    this.tipoContrato = properties.tipoContrato || combos.tipoContrato[0].id;
    this.categoriaProfesional = properties.categoriaProfesional || combos.categoriaProfesional[0].id;
    this.estadoCivil = properties.estadoCivil || combos.estadoCivil[0].id;
  }

  calcularSueldoNeto(): SueldoNetoOutput {
    this.validarDatosNeto();

    const {
      brutoAnual,
      numeroPagas,
      edad,
      conyugeCobraMasDe1500,
      movilidadGeografica,
      esDiscapacitado,
      discapacidadMayorDe65,
      hijos,
      hijosEnExclusividad,
      ascendientes,
      personasDeduccionAscendientes,
      tipoContrato,
      categoriaProfesional,
      estadoCivil
    } = this;

    // Datos de entrada
    const hijosMenoresDe25 = utils.hijosMenoresDe25(hijos);
    const tipoSituacionFamiliar = utils.tipoSituacionFamiliar(estadoCivil, conyugeCobraMasDe1500, hijosMenoresDe25);

    // Paso 1: Calcular base imponible
    const cuotaMensual = utils.calcularCuotaMensual(brutoAnual, categoriaProfesional, tipoContrato);
    const cuotaAcumuladaAnual = cuotaMensual * 12;
    const baseImponible = utils.baseImponible(hijos, brutoAnual, cuotaAcumuladaAnual, movilidadGeografica, esDiscapacitado, discapacidadMayorDe65);

    // Paso 2: Calcular el mínimo personal y familiar
    const minimos = utils.calcularMinimo(edad, hijos, hijosEnExclusividad, ascendientes, personasDeduccionAscendientes, esDiscapacitado, discapacidadMayorDe65);

    // Paso 3: Calcular retenciones
    const cuotaRetencion = utils.calcularCuotaBaseLiquidable(baseImponible) - utils.calcularCuotaBaseLiquidable(minimos);
    const tipoPrevio = cuotaRetencion / brutoAnual;
    const importePrevioRetencion = utils.redondearDigitos(tipoPrevio * brutoAnual);
    let tipoFinalRetencion = (importePrevioRetencion - deduccionEspecial) / brutoAnual;
    tipoFinalRetencion = tipoFinalRetencion < 0 ? 0 : utils.truncarDigitos(tipoFinalRetencion, 4);
    const importeFinalRetencion = tipoFinalRetencion * brutoAnual;

    // Paso 4: Calcular sueldo
    const seguridadSocial = cuotaAcumuladaAnual;
    const tipoRetencion = utils.calcularTipoRetencionSituacionFamiliar(tipoFinalRetencion, tipoSituacionFamiliar, hijosMenoresDe25, brutoAnual, tipoContrato);
    const importeRetencion = importeFinalRetencion;

    const netoAnual = brutoAnual - seguridadSocial - importeRetencion;
    const pagasExtras = (brutoAnual - importeRetencion) / numeroPagas;
    const netoMensual = pagasExtras - (seguridadSocial / 12);

    // Output
    return {
      brutoAnual,
      netoAnual,
      netoMensual,
      tieneExtras: numeroPagas > 12,
      pagasExtras,
      retencionIRPF: importeRetencion,
      tipoRetencionIRPF: tipoRetencion,
      cuotasSeguridadSocial: seguridadSocial
    };
  }

  get tipoContratoInfo() {
    return combos.tipoContrato.find(contrato => contrato.id === this.tipoContrato) || combos.tipoContrato[0];
  }

  get categoriaProfesionalInfo() {
    return combos.categoriaProfesional.find(cat => cat.id === this.categoriaProfesional) || combos.categoriaProfesional[0];
  }

  calcularSueldoBruto(): SueldoBrutoOutput {
    this.validarDatosBruto();

    const {
      netoMensual,
      numeroPagas,
      edad,
      conyugeCobraMasDe1500,
      movilidadGeografica,
      esDiscapacitado,
      discapacidadMayorDe65,
      hijos,
      hijosEnExclusividad,
      ascendientes,
      personasDeduccionAscendientes,
      tipoContrato,
      categoriaProfesional,
      estadoCivil,
    } =this;


    // Resultado por aproximación
    const valorInicial = 50000;
    const incrementoSuperior = 100000;
    const presicion = 0.1; // Diferencia entre el valor superior y el inferior
    const iteracionesMaximas = 1000;

    let valorSuperior = Infinity;
    let valorInferior = 0;
    let valorActual = valorInicial;

    let input = {
      brutoAnual: valorActual,
      numeroPagas,
      edad,
      conyugeCobraMasDe1500,
      movilidadGeografica,
      esDiscapacitado,
      discapacidadMayorDe65,
      hijos,
      hijosEnExclusividad,
      ascendientes,
      personasDeduccionAscendientes,
      tipoContrato,
      categoriaProfesional,
      estadoCivil
    };
    let resultadoActual : SueldoNetoOutput = new CalculadoraSueldo(input).calcularSueldoNeto();
    let i;

    for (i = 0; resultadoActual.netoMensual !== netoMensual && Math.abs(valorSuperior - valorInferior) > presicion && i < iteracionesMaximas; i++) {
      if (resultadoActual.netoMensual < netoMensual) {
        valorInferior = valorActual;
        if (valorSuperior === Infinity) {
          valorActual += incrementoSuperior;
        } else {
          valorActual += (valorSuperior - valorInferior) / 2;
        }
      } else {
        valorSuperior = valorActual;
        valorActual -= (valorSuperior - valorInferior) / 2;
      }
      input.brutoAnual = valorActual;
      resultadoActual = new CalculadoraSueldo(input).calcularSueldoNeto();
    }

    const resultado: SueldoBrutoOutput = {
      ...resultadoActual,
      iteraciones: i
    };

    // Output
    return resultado;
  }

  private validarDatosNeto() {
    const { brutoAnual, numeroPagas, edad } = validation;
    const validationNeto = { brutoAnual, numeroPagas, edad };
    return this.validate(validationNeto);
  }

  private validarDatosBruto() {
    const { netoMensual, numeroPagas, edad } = validation;
    const validationBruto = { netoMensual, numeroPagas, edad };
    return this.validate(validationBruto);
  }

  private validate(validation: any) {
    const messages = Object.entries(validation).map(([field, validations]) => {
      // @ts-ignore
      const messages: Array<string> = validations.map(validation => validation.validator(this[field]) ? '' : validation.msg);
      return messages;
    }).reduce((acc, elem) => acc.concat(elem), []);

    const invalidMessages = messages.filter(msg => msg);

    if (invalidMessages.length) {
      throw new ValidationError(invalidMessages);
    }
    return true;
  }
}

class ValidationError extends Error {
  messages: Array<string>;
  constructor(messages: Array<string>) {
    super();
    this.messages = messages;
  }
}

export default CalculadoraSueldo;