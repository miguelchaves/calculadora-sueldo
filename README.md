# Calculadora de sueldo

[![CI/CD](https://github.com/miguelchaves/calculadora-sueldo/actions/workflows/node.js.yml/badge.svg)](https://github.com/miguelchaves/calculadora-sueldo/actions/workflows/node.js.yml)
[![Test Results](https://raw.githubusercontent.com/gist/miguelchaves/e1322bdeacf4783dafc8911db1429896/raw/badge.svg)](https://github.com/miguelchaves/calculadora-sueldo/actions/workflows/node.js.yml)
[![GitHub release badge](https://badgen.net/github/release/miguelchaves/calculadora-sueldo/stable)](https://github.com/miguelchaves/calculadora-sueldo/releases/latest)
[![GitHub license badge](https://badgen.net/github/license/miguelchaves/calculadora-sueldo)](https://github.com/miguelchaves/calculadora-sueldo/blob/main/LICENSE)

## Descripcion
Librería Javascript & Typescript para calcular sueldo bruto anual, o sueldo neto mensual, junto con el IRPF a partir del algoritmo de la Agencia Tritubaria

Instalación
-----------

```bash
$ npm install calculadora-sueldo
```

Documentación
-------------

La librería expone la clase `CalculadoraSueldo`, que, una vez instanciada, tendrá disponible los métodos `calcularSueldoNeto()` y `calcularSueldoBruto()`.

Además, todos los combos necesarios para mostrar en el formulario están definidos como arrays en `combos`.

#### Calcular Sueldo Neto

Calcula el sueldo neto a partir del sueldo bruto anual.

```javascript
import { combos, CalculadoraSueldo } from 'calculadora-sueldo';

const INGENIERO = combos.categoriaProfesional[0].id;
const SOLTERO = combos.estadoCivil[1].id;
const INDEFINIDO = combos.tipoContrato[0].id;

const input = {
  /** @type {Number} Sueldo bruto anual */
  brutoAnual: 30000,
  /** @type {Number} Número de pagas. Opcional, 12 por defecto.
   * Debe ser >=12 */
  numeroPagas: 14,
  /** @type {Number} Edad en años */
  edad: 45,
  /** @type {Boolean} Opcional, false por defecto.
   * Solo aplica para casados */
  conyugeCobraMasDe1500: false,
  /** @type {Boolean} Opcional, false por defecto */
  movilidadGeografica: false,
  /** @type {Boolean} Opcional, false por defecto */
  esDiscapacitado: false,
  /** @type {Boolean} Opcional, false por defecto */
  discapacidadMayorDe65: false,
  /** @type {Hijos[]} Opcional, [] por defecto
   * Se puede importar la clase Hijo de la librería */
  hijos: [],
  /** @type {Boolean} Opcional, false por defecto */
  hijosEnExclusividad: false,
  /** @type {Ascendiente[]} Opcional, [] por defecto
   * Se puede importar la clase Ascendiente de la librería */
  ascendientes: [],
  /** @type {Number} Número de personas que se deducen del cuidado del mayor.
   * Opcional, 1 por defecto
   * Debe ser > 1 (incluyéndote a ti) */
  personasDeduccionAscendientes: 1,
  /** @type {string} Identificador del tipo de contrato
   * Disponible en combos.tipoContrato[].id */
  tipoContrato: INDEFINIDO,
  /** @type {string} Identificador de la categoría profesional
   * Disponible en combos.categoriaProfesional[].id */
  categoriaProfesional: INGENIERO,
  /** @type {string} Identificador del estado civil
   * Disponible en combos.estadoCivil[].id */
  estadoCivil: SOLTERO
};

const output = new CalculadoraSueldo(inputs).calcularSueldoNeto();

// Valores obtenidos:
const {
  /** @type {Number} valor de entrada */
  brutoAnual,
  /** @type {Number} Sueldo neto anual */
  netoAnual,
  /** @type {Number} Sueldo neto mensual, sin contar pagas extras */
  netoMensual,
  /** @type {Boolean} Tiene pagas extras si el número de pagas es > 12 */
  tieneExtras,
  /** @type {Number} Importe de cada paga extra */
  pagasExtras,
  /** @type {Number} Importe anual de la retención por IRPF */
  retencionIRPF,
  /** @type {Number} Porcentaje de la retención por IRPF. Por ejemplo: 0.15 */
  tipoRetencionIRPF,
  /** @type {Number} Importe anual de las cuotas a la seguridad social */
  cuotasSeguridadSocial
} = output;
```

#### Calcular Sueldo Bruto
Calcula el sueldo bruto anual a partir del neto mensual.

```javascript
import { combos, calcularSueldoBruto } from 'salary-calculator';

const INGENIERO = combos.categoriaProfesional[0].id;
const SOLTERO = combos.estadoCivil[1].id;
const INDEFINIDO = combos.tipoContrato[0].id;

const input = {
  /** @type {Number} Sueldo bruto anual */
  netoMensual: 3000,
  /** @type {Number} Número de pagas. Opcional, 12 por defecto.
   * Debe ser >=12 */
  numeroPagas: 14,
  /** @type {Number} Edad en años */
  edad: 45,
  /** @type {Boolean} Opcional, false por defecto.
   * Solo aplica para casados */
  conyugeCobraMasDe1500: false,
  /** @type {Boolean} Opcional, false por defecto */
  movilidadGeografica: false,
  /** @type {Boolean} Opcional, false por defecto */
  esDiscapacitado: false,
  /** @type {Boolean} Opcional, false por defecto */
  discapacidadMayorDe65: false,
  /** @type {Hijos[]} Opcional, [] por defecto
   * Se puede importar la clase Hijo de la librería */
  hijos: [],
  /** @type {Boolean} Opcional, false por defecto */
  hijosEnExclusividad: false,
  /** @type {Ascendiente[]} Opcional, [] por defecto
   * Se puede importar la clase Ascendiente de la librería */
  ascendientes: [],
  /** @type {Number} Número de personas que se deducen del cuidado del mayor.
   * Opcional, 1 por defecto
   * Debe ser > 1 (incluyéndote a ti) */
  personasDeduccionAscendientes: 1,
  /** @type {string} Identificador del tipo de contrato
   * Disponible en combos.tipoContrato[].id */
  tipoContrato: INDEFINIDO,
  /** @type {string} Identificador de la categoría profesional
   * Disponible en combos.categoriaProfesional[].id */
  categoriaProfesional: INGENIERO,
  /** @type {string} Identificador del estado civil
   * Disponible en combos.estadoCivil[].id */
  estadoCivil: SOLTERO
};

const output = new CalculadoraSueldo(inputs).calcularSueldoBruto();

// Valores obtenidos:
const {
  brutoAnual,                       // Number
  netoAnual,                        // Number, suma de las pagas mensuales y extras
  netoMensual,                      // Number, cantidad del sueldo mensual
  tieneExtras,                      // Boolean
  pagasExtras,                      // Number, cantidad de cada paga extra
  retencionIRPF,                    // Number, cantidad de retencion por IRPF
  tipoRetencionIRPF,                // Number, porcentaje de retencion por IRPF sobre el sueldo bruto
  cuotasSeguridadSocial             // Number, cantidad anual de retención de la Seguridad Social
  iteraciones                       // Number, indica la cantidad de iteraciones realizadas (sin interes para el cliente)
} = output;

// Valores obtenidos:
const {
  /** @type {Number} Sueldo bruto anual */
  brutoAnual,
  /** @type {Number} Sueldo neto anual */
  netoAnual,
  /** @type {Number} Valor de entrada. Sueldo neto mensual, sin contar pagas extras */
  netoMensual,
  /** @type {Boolean} Tiene pagas extras si el número de pagas es > 12 */
  tieneExtras,
  /** @type {Number} Importe de cada paga extra */
  pagasExtras,
  /** @type {Number} Importe anual de la retención por IRPF */
  retencionIRPF,
  /** @type {Number} Porcentaje de la retención por IRPF. Por ejemplo: 0.15 */
  tipoRetencionIRPF,
  /** @type {Number} Importe anual de las cuotas a la seguridad social */
  cuotasSeguridadSocial,
  /** @type {Number} indica la cantidad de iteraciones realizadas
   * (sin interes para el cliente) */
  iteraciones
} = output;
```

#### Clases Hijo y Ascendiente

Deben tener definidas las propiedades `edad`, `esDiscapacitado` y `discapacidadMayorDe65`. Pueden ser simples objetos:

```javascript
import { Hijo, Ascendiente } from 'calculadora-sueldo.js';
const hijo1 = new Hijo(45, true, false);
const hijo2 = {
  edad: 45,
  esDiscapacitado: true,
  discapacidadMayorDe65: false
};
// hijo1 ~= hijo2
```

#### Combos

El valor de los parámetros `tipoContrato`, `categoríaProfesional` o `estadoCivil` deben coincidir con la propiedad `id` de los combos definidos en `constants`. Pueden usarse estos combos a modo de `select`s en el formulario, aunque será necesaria la traducción de los literales a otros idiomas.


Construcción
-------------
```bash
$ npm run build
```
Crea diferentes versiones de la librería en `dist/`:
* `dist/cualculadora-sueldo.js` Módulo en formato *CommonsJS*
* `dist/cualculadora-sueldo.mjs` Módulo en formato *ES6*
* `dist/cualculadora-sueldo.d.ts` Declaración de tipos para Typescript

Historial de versiones
-------------
* *`v0.0.1`*: Primera versión de la librería con la información del ejercicio de 2021


Tests
-------------

```bash
$ npm test
```
