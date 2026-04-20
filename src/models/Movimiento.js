// Modelo Movimiento - Herencia de clase base Registro
const fs = require('fs');
const path = require('path');

const DATA_PATH = path.join(__dirname, '../data/movimientos.json');

// Clase base
class Registro {
  constructor(id, fecha) {
    this.id    = id;
    this.fecha = fecha;
  }

  getFechaFormateada() {
    return new Date(this.fecha).toLocaleDateString('es-AR');
  }
}

// Movimiento hereda de Registro
class Movimiento extends Registro {
  #productoId;
  #productoNombre;
  #tipo;
  #cantidad;
  #motivo;

  constructor({ id, productoId, productoNombre, tipo, cantidad, fecha, motivo }) {
    super(id, fecha); // llama al constructor padre
    this.#productoId     = productoId;
    this.#productoNombre = productoNombre;
    this.#tipo           = tipo;
    this.#cantidad       = cantidad;
    this.#motivo         = motivo;
  }

  get productoId()     { return this.#productoId; }
  get productoNombre() { return this.#productoNombre; }
  get tipo()           { return this.#tipo; }
  get cantidad()       { return this.#cantidad; }
  get motivo()         { return this.#motivo; }

  // Propiedad computada: indica si afecta positiva o negativamente el stock
  get impacto() {
    return this.#tipo === 'ingreso' ? `+${this.#cantidad}` : `-${this.#cantidad}`;
  }

  toJSON() {
    return {
      id:             this.id,
      productoId:     this.#productoId,
      productoNombre: this.#productoNombre,
      tipo:           this.#tipo,
      cantidad:       this.#cantidad,
      fecha:          this.fecha,
      motivo:         this.#motivo
    };
  }

  static getAll() {
    const data = JSON.parse(fs.readFileSync(DATA_PATH, 'utf-8'));
    return data.map(m => new Movimiento(m));
  }

  static getById(id) {
    return Movimiento.getAll().find(m => m.id === parseInt(id)) || null;
  }

  static getByProducto(productoId) {
    return Movimiento.getAll().filter(m => m.productoId === parseInt(productoId));
  }

  static getByTipo(tipo) {
    return Movimiento.getAll().filter(m => m.tipo === tipo);
  }

  static saveAll(movimientos) {
    fs.writeFileSync(DATA_PATH, JSON.stringify(movimientos.map(m => m.toJSON()), null, 2), 'utf-8');
  }

  static create(datos) {
    const movimientos = Movimiento.getAll();
    const nuevoId     = movimientos.length > 0 ? Math.max(...movimientos.map(m => m.id)) + 1 : 1;
    const fecha       = datos.fecha || new Date().toISOString().split('T')[0];
    const nuevo       = new Movimiento({ ...datos, id: nuevoId, fecha });
    movimientos.push(nuevo);
    Movimiento.saveAll(movimientos);
    return nuevo;
  }

  static delete(id) {
    let movimientos = Movimiento.getAll();
    const idx       = movimientos.findIndex(m => m.id === parseInt(id));
    if (idx === -1) return false;
    movimientos.splice(idx, 1);
    Movimiento.saveAll(movimientos);
    return true;
  }
}

module.exports = Movimiento;
