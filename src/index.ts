export { Hijo, Ascendiente } from './class'
export { CalculadoraSueldo } from './calculator';

import { combos as cCombos } from './constants';

// Exponer selectores y filtrar propiedades
export const combos = Object.entries(cCombos).reduce((acc: any, [combo, list]) => {
  acc[combo] = list.map(({id, text}) => ({ id, text }));
  return acc;
}, {});