// Modelo Producto - POO con propiedades privadas, getters y métodos estáticos
const fs = require('fs');
const path = require('path');

const DATA_PATH = path.join(__dirname, '../data/productos.json');

class Producto {
  #id;
  #nombre;
  #precio;
  #stock;
  #unidad;
  #lote;
  #vencimiento;
  #estado;

  constructor({ id, nombre, precio, stock, unidad, lote, vencimiento, estado = 'activo' }) {
    this.#id          = id;
    this.#nombre      = nombre;
    this.#precio      = precio;
    this.#stock       = stock;
    this.#unidad      = unidad;
    this.#lote        = lote;
    this.#vencimiento = vencimiento;
    this.#estado      = estado;
  }

  // Getters
  get id()          { return this.#id; }
  get nombre()      { return this.#nombre; }
  get precio()      { return this.#precio; }
  get stock()       { return this.#stock; }
  get unidad()      { return this.#unidad; }
  get lote()        { return this.#lote; }
  get vencimiento() { return this.#vencimiento; }
  get estado()      { return this.#estado; }

  // Setter con validación
  set stock(nuevoStock) {
    if (nuevoStock < 0) throw new Error('El stock no puede ser negativo');
    this.#stock = nuevoStock;
  }

  set estado(nuevoEstado) {
    const validos = ['activo', 'inactivo'];
    if (!validos.includes(nuevoEstado)) throw new Error(`Estado inválido: ${nuevoEstado}`);
    this.#estado = nuevoEstado;
  }

  // Propiedad computada: alerta de stock bajo (menos de 10 unidades)
  get stockBajo() {
    return this.#stock < 10;
  }

  toJSON() {
    return {
      id:          this.#id,
      nombre:      this.#nombre,
      precio:      this.#precio,
      stock:       this.#stock,
      unidad:      this.#unidad,
      lote:        this.#lote,
      vencimiento: this.#vencimiento,
      estado:      this.#estado
    };
  }

  // Métodos estáticos (repositorio)
  static getAll() {
    const data = JSON.parse(fs.readFileSync(DATA_PATH, 'utf-8'));
    return data.map(p => new Producto(p));
  }

  static getById(id) {
    return Producto.getAll().find(p => p.id === parseInt(id)) || null;
  }

  static getActivos() {
    return Producto.getAll().filter(p => p.estado === 'activo');
  }

  static saveAll(productos) {
    fs.writeFileSync(DATA_PATH, JSON.stringify(productos.map(p => p.toJSON()), null, 2), 'utf-8');
  }

  static create(datos) {
    const productos = Producto.getAll();
    const nuevoId   = productos.length > 0 ? Math.max(...productos.map(p => p.id)) + 1 : 1;
    const nuevo     = new Producto({ ...datos, id: nuevoId });
    productos.push(nuevo);
    Producto.saveAll(productos);
    return nuevo;
  }

  static updateStock(id, nuevoStock) {
    const productos = Producto.getAll();
    const producto  = productos.find(p => p.id === parseInt(id));
    if (!producto) return null;
    producto.stock = nuevoStock;
    Producto.saveAll(productos);
    return producto;
  }

  static updateEstado(id, nuevoEstado) {
    const productos = Producto.getAll();
    const producto  = productos.find(p => p.id === parseInt(id));
    if (!producto) return null;
    producto.estado = nuevoEstado;
    Producto.saveAll(productos);
    return producto;
  }

  static delete(id) {
    let productos = Producto.getAll();
    const idx     = productos.findIndex(p => p.id === parseInt(id));
    if (idx === -1) return false;
    productos.splice(idx, 1);
    Producto.saveAll(productos);
    return true;
  }
}

module.exports = Producto;
