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