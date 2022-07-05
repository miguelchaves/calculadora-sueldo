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

Para probar la librería puedes hacer uso de la siguiente aplicación: https://herramientas-financieras.firebaseapp.com/calculadora-sueldo


Documentación
-------------

La librería expone la clase `CalculadoraSueldo`, que, una vez instanciada, tendrá disponible los métodos `calcularSueldoNeto()` y `calcularSueldoBruto()`.

Además, todos los combos necesarios para mostrar en el formulario están definidos como arrays en `combos`.

### Datos de entrada:

| Campo | Tipo | Descripción | Valor por defecto | Ejemplo |
|-------|-----|--------------|-------------------|---------|
| `brutoAnual` | `Number` | Sueldo bruto anual, obligatorio para calcular sueldo neto | N/A | `30000` |
| `netoMensual` | `Number` | Sueldo neto mensual, obligatorio para calcular sueldo bruto anual | N/A | `2500` |
| `numeroPagas`| `Number` | Número de pagas repartidas en el año | `12` | ` 14` |
| `edad` | `Number` | Edad en años (> 16 y < 150) | N/A | `30` | 
| `conyugeCobraMasDe1500` | `Boolean` | Opcional, solo aplica para casados | `false` | `true`|
| `movilidadGeografica` | `Boolean` | Indica si tiene o no movilidad geográfica | `false` | `true` |
| `esDiscapacitado`| `Boolean` | Indica si es o no disacapacitado | `false` | ` true` |
| `discapacidadMayorDe65`| `Boolean` | Indica si su discpacidad es > 65%. Solo aplica cuando `esDiscacitado = true`| `false` | `true` |
| `hijos` | `Hijo[]` | Array de hijos, se puede importar la clase `Hijo` de la librería | `[]` | `[]` |
| `hijosEnExclusividad` | `Boolean`| Indica si tiene los hijos en exclusividad a efectos fiscales. Solo aplica cuando se informan hijos | `false` | `true` |
| `ascendientes` | `Ascendiente[]` | Array de mayores a cargo. Se puede importar la clase `Ascendiente` de la librería | `[]`| `[]` |
| `personasDeduccionAscendientes` | `Number` | Número de contribuyentes a cargo del cuidado de los mayores, incluyéndote a ti (>= 1). Solo aplica cuando se informan ascendientes | `1` | `3`|
| `tipoContrato` | `String` | Identificador del tipo de contrato. Ver `combos.tipoContrato` | `"general"` | `"temporal"`
| `categoriaProfesional` | `String` | Identificador de la categoría profesional. Ver `combos.categoriaProfesional` | `A` | `B` |
| `estadoCivil` | `String`| Identificador del estado civil. Ver `combos.estadoCivil` | `2` | `1` |

### Datos de salida:

| Campo | Tipo | Descripción | Ejemplo |
|-------|-----|--------------|---------|
| `brutoAnual` | `Number` | Sueldo bruto anual | `30000` |
| `netoAnual` | `Number` | Sueldo neto anual, sumando pagas ordinarias y extras | `2500` |
| `netoMensual` | `Number` | Sueldo neto mensual | `2500` |
| `tieneExtras`| `Boolean` | Indica si tiene pagas extras (`numeroPagas > 12`) | `false` |
| `pagasExtras` | `Number` | Importe de cada paga extra | `2815.25` | 
| `retencionIRPF` | `Number` | Importe total de la retención por IRPF | `8437.28` |
| `tipoRetencionIRPF` | `Number` | Porcentaje de retención de IRPF sobre el sueldo bruto | `0.195` |
| `cuotasSeguridadSocial`| `Number` | Importe total anual de las cuotas de la Seguridad Social | `1905` |
| `iteraciones`| `Number` | Indica la cantidad de iteraciones realizadas para el cálculo del sueldo bruto. Sin interés para el cliente | `9` |

### Calcular Sueldo Neto

Calcula el sueldo neto a partir del sueldo bruto anual.

```javascript
import { combos, CalculadoraSueldo } from 'calculadora-sueldo';

const INGENIERO = combos.categoriaProfesional[0].id;
const SOLTERO = combos.estadoCivil[1].id;
const INDEFINIDO = combos.tipoContrato[0].id;

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

const output = new CalculadoraSueldo(inputs).calcularSueldoNeto();

// Valores obtenidos:
const {
  brutoAnual,
  netoAnual,
  netoMensual,
  tieneExtras,
  pagasExtras,
  retencionIRPF,
  tipoRetencionIRPF,
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

const inputs = {
  netoMensual: 3000,
  numeroPagas: 14,
  edad: 45,
  tipoContrato: INDEFINIDO,
  categoriaProfesional: INGENIERO,
  estadoCivil: SOLTERO
};

const output = new CalculadoraSueldo(inputs).calcularSueldoBruto();

// Valores obtenidos:
const {
  brutoAnual,
  netoAnual,
  netoMensual,
  tieneExtras,
  pagasExtras,
  retencionIRPF,
  tipoRetencionIRPF,
  cuotasSeguridadSocial
  iteraciones
} = output;
```

### Clases Hijo y Ascendiente

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

### Combos

El valor de los parámetros `tipoContrato`, `categoríaProfesional` o `estadoCivil` deben coincidir con la propiedad `id` de los combos definidos en `combos`. Pueden usarse estos combos a modo de `select`s en el formulario.

#### Tipo de contrato
| id | text |
|----|------|
| `"general"` | General |
| `"temporal"` | Inferior a 12 meses |


#### Estado civil
| id | text |
|----|------|
| `"1"` | Viudo/a |
| `"2"` | Soltero/a |
| `"3"` | Divorciado/a |
| `"4"` | Separado/a legalmente |
| `"5"` | Casado/a |


#### Categoría profesional
| id | text |
|----|------|
| `"A"` | Ingenieros y Licenciados |
| `"B"` | Ingenieros Técnicos, Peritos y Ayudantes Titulados |
| `"C"` | Jefes Administrativos y de Taller |
| `"D"` | Ayudantes no Titulados |
| `"E"` | Oficiales Administrativos |
| `"F"` | Subalternos |
| `"G"` | Auxiliares Administrativos |
| `"H"` | Oficiales de primera y segunda |
| `"I"` | Oficiales de tercera y Especialistas |
| `"J"` | Peones |
| `"K"` | Trabajadores menores de dieciocho años, cualquiera |


Construcción
-------------
```bash
$ npm run build
```
Crea diferentes versiones de la librería en `dist/`:
* `dist/cualculadora-sueldo.js`. Módulo en formato *CommonsJS*
* `dist/cualculadora-sueldo.mjs`. Módulo en formato *ES6*
* `dist/cualculadora-sueldo.d.ts`. Declaración de tipos para *Typescript*

Historial de versiones
-------------
* *`v0.0.1`*: Primera versión de la librería con la información del ejercicio de 2021


Tests
-------------

```bash
# Devuelve el resultado por la salida del terminal sin generar archivos:
$ npm run test:no-file

# Devuelve el resultado en un JSON: report.json
$ npm test
```
