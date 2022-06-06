import assert from 'assert';
import { isUndefined, isArray } from 'util';
import { combos, Hijo, Ascendiente, CalculadoraSueldo } from '../src/index';

describe('Combos / Selectores', () => {
  describe('Está definido en la propiedad combos', () => {
    it('Debe estar definido como un objeto', () => {
      assert.equal(typeof combos, 'object');
    });
  });
  describe('Debe tener la estructura esperada', () => {
    const { categoriaProfesional, estadoCivil, tipoContrato } = combos;
    it('Categoría profesional es una lista', () => {
      assert.ok(isArray(categoriaProfesional));
    });
    it('Estado civil es una lista', () => {
      assert.ok(isArray(estadoCivil));
    });
    it('Tipo de contrato es una lista', () => {
      assert.ok(isArray(tipoContrato));
    });
    it('Todos los valores de los combos son objetos con propiedades id y text', () => {
      categoriaProfesional
        .concat(estadoCivil)
        .concat(tipoContrato)
        .forEach((item: any) => {
          assert.equal(typeof item, 'object');
          assert.ok(!isUndefined(item.id));
          assert.equal(typeof item.text, 'string');
        });
    });
  });
});

describe('Clases Hijo y Ascendiente', () => {
  describe('Están definidos', () => {
    it('Están definidos como una clase (función)', () => {
      assert.equal(typeof Hijo, 'function');
      assert.equal(typeof Ascendiente, 'function');
    });
  });
  describe('Instancias de Hijo y Asenciente', function () {
    it('Las instancias de Hijo poseen las propiedades esperadas', () => {
      const edad = 5;
      const esDiscapacitado = true;
      const discapacidadMayorDe65 = false;
      const hijo  = new Hijo(edad, esDiscapacitado, discapacidadMayorDe65);
      assert.equal(hijo.edad, edad);
      assert.equal(hijo.esDiscapacitado, esDiscapacitado);
      assert.equal(hijo.discapacidadMayorDe65, discapacidadMayorDe65);
    });

    it('Las instancias de Ascendiente poseen las propiedades esperadas', () => {
      const edad = 75;
      const esDiscapacitado = true;
      const discapacidadMayorDe65 = true;
      const ascendiente  = new Ascendiente(edad, esDiscapacitado, discapacidadMayorDe65);
      assert.equal(ascendiente.edad, edad);
      assert.equal(ascendiente.esDiscapacitado, esDiscapacitado);
      assert.equal(ascendiente.discapacidadMayorDe65, discapacidadMayorDe65);
    });
  });
});

const INGENIERO = combos.categoriaProfesional[0].id;
const SOLTERO = combos.estadoCivil[1].id;
const INDEFINIDO = combos.tipoContrato[0].id;

describe('Calculadora de sueldo', () => {
  describe('Está definida y es una clase', () => {
    it('Debe estar definida como una función', () => {
      assert.equal(typeof CalculadoraSueldo, 'function');
    });
  });
});

describe('Calculadora Sueldo Neto', () => {
  const inputs = {
    brutoAnual: 30000,
    numeroPagas: 14,
    edad: 45,
    conyugeCobraMasDe1500: false,
    movilidadGeografica: false,
    esDiscapacitado: false,
    discapacidadMayorDe65: false,
    hijos: [],
    hijosEnExclusividad: false,
    ascendientes: [],
    personasDeduccionAscendientes: 1,
    tipoContrato: INDEFINIDO,
    categoriaProfesional: INGENIERO,
    estadoCivil: SOLTERO
  };
  const calculadoraSueldo = new CalculadoraSueldo(inputs);

  describe('Está definida y es una función', () => {
    it('Debe estar definida como una función', () => {
      assert.equal(typeof calculadoraSueldo.calcularSueldoNeto, 'function');
    });
  });
  describe('El output debe tener la estructura esperada', () => {
    it('Devuelve el output esperado', () => {
      const output: any = calculadoraSueldo.calcularSueldoNeto();
      const propertiesExpected = {
        brutoAnual: 'number',
        netoAnual: 'number',
        netoMensual: 'number',
        tieneExtras: 'boolean',
        pagasExtras: 'number',
        retencionIRPF: 'number',
        tipoRetencionIRPF: 'number',
        cuotasSeguridadSocial: 'number'
      };
      assert.ok(typeof output === 'object' && Object.entries(propertiesExpected).every(([key, type]) => typeof output[key] === type));
    });
  });

  describe('Los resultados obtenidos son coherentes', () => {
    const output = calculadoraSueldo.calcularSueldoNeto();
    it('El bruto anual es mayor que el neto anual', () => {
      assert.ok(output.brutoAnual > output.netoAnual);
    });
    it('Si tiene pagas extras, el valor de la paga extra es mayor que el neto mensual debido a las pagas de la seguridad social', () => {
      assert.ok(inputs.numeroPagas > 12 ? output.pagasExtras > output.netoMensual : true);
    });
    it('El tipo de retención es un porcentaje (un valor entre 0 y 1)', () => {
      assert.ok(output.tipoRetencionIRPF >= 0 && output.tipoRetencionIRPF < 1);
    });
    it('Siempre se paga a la seguridad social independientemente de los ingresos', () => {
      assert.ok(output.cuotasSeguridadSocial > 0);
    });

    const inputHijoMenor25 = {
      ...inputs,
      hijos: [new Hijo(10, false, false)]
    }
    const outputHijoMenor25 = new CalculadoraSueldo(inputHijoMenor25).calcularSueldoNeto();

    const inputHijoMenor3 = {
      ...inputs,
      hijos: [new Hijo(2, false, false)]
    };
    const outputHijoMenor3 = new CalculadoraSueldo(inputHijoMenor3).calcularSueldoNeto();

    const inputHijosMayor25 = {
      ...inputs,
      hijos: [new Hijo(28, false, false)]
    };
    const outputHijoMayor25 = new CalculadoraSueldo(inputHijosMayor25).calcularSueldoNeto();

    const inputHijoDiscapacitado = {
      ...inputs,
      hijos: [new Hijo(28, true, false)]
    };
    const outputHijoDiscapacitado = new CalculadoraSueldo(inputHijoDiscapacitado).calcularSueldoNeto();

    it('Si tienes hijos, tienes beneficios fiscales', () => {
      assert.ok(output.retencionIRPF > outputHijoMenor25.retencionIRPF);
      assert.ok(output.retencionIRPF > outputHijoMenor3.retencionIRPF);
    });

    it('Tener un hijo menor de 3 años tiene más beneficios fiscales que tener uno menor de 25', () => {
      assert.ok(outputHijoMenor25.retencionIRPF > outputHijoMenor3.retencionIRPF);
    });

    it('Tener un hijo mayor de 25 años no tiene beneficios fiscales', () => {
      assert.equal(outputHijoMayor25.retencionIRPF, output.retencionIRPF);
    });

    it('Tener un hijo discapacitado mayor de 25 años sí tiene beneficios fiscales', () => {
      assert.ok(output.retencionIRPF > outputHijoDiscapacitado.retencionIRPF);
    });

    it('Un hijo discapacitado tiene más beneficios fiscales que un hijo sin discapacidad', () => {
      assert.ok(outputHijoMenor25.retencionIRPF > outputHijoDiscapacitado.retencionIRPF);
    });

    const inputDiscapacidadLeve = {
     ...inputs,
     esDiscapacitado: true
    };
    const outputDiscapacidadLeve = new CalculadoraSueldo(inputDiscapacidadLeve).calcularSueldoNeto();

    const inputDiscapacidadModerada = {
      ...inputs,
      esDiscapacitado: true,
      discapacidadMayorDe65: true
     };
    const outputDiscapacidadModerada = new CalculadoraSueldo(inputDiscapacidadModerada).calcularSueldoNeto();

    it('Padecer una discapacidad conlleva beneficios fiscales', () => {
      assert.ok(output.retencionIRPF > outputDiscapacidadLeve.retencionIRPF);
      assert.ok(output.retencionIRPF > outputDiscapacidadModerada.retencionIRPF);
    });

    it('Padecer una discapacidad moderada (mayor del 65%) conlleva más beneficios fiscales que una discapacidad leve (entre el 33% y el 65%)', () => {
      assert.ok(outputDiscapacidadLeve.retencionIRPF > outputDiscapacidadModerada.retencionIRPF);
    });
  });
});

describe('Calculadora Sueldo Bruto', () => {
  describe('Está definida y es una función', () => {
    it('Debe estar definida como una función', () => {
      assert.equal(typeof new CalculadoraSueldo().calcularSueldoBruto, 'function');
    });
  });
  describe('El output debe tener la estructura esperada', () => {
    it('Devuelve el output esperado', () => {
      const input = {
        netoMensual: 1560,
        numeroPagas: 14,
        edad: 45,
        conyugeCobraMasDe1500: false,
        movilidadGeografica: false,
        esDiscapacitado: false,
        discapacidadMayorDe65: false,
        hijos: [] ,
        hijosEnExclusividad: false,
        ascendientes: [],
        personasDeduccionAscendientes: 1,
        tipoContrato: INDEFINIDO,
        categoriaProfesional: INGENIERO,
        estadoCivil: SOLTERO
      };
      const output: any = new CalculadoraSueldo(input).calcularSueldoBruto();
      const propertiesExpected = {
        brutoAnual: 'number',
        netoAnual: 'number',
        netoMensual: 'number',
        tieneExtras: 'boolean',
        pagasExtras: 'number',
        retencionIRPF: 'number',
        tipoRetencionIRPF: 'number',
        cuotasSeguridadSocial: 'number'
      };
      assert.ok(typeof output === 'object' && Object.entries(propertiesExpected).every(([key, type]) => typeof output[key] === type));
    });
  });
});