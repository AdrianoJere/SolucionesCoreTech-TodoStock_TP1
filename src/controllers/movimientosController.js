// Controlador de Movimientos
const Movimiento = require('../models/Movimiento');
const Producto   = require('../models/Producto');

const listarMovimientos = (req, res) => {
  const { tipo, productoId } = req.query;
  let movimientos = Movimiento.getAll();
  if (tipo)       movimientos = movimientos.filter(m => m.tipo === tipo);
  if (productoId) movimientos = movimientos.filter(m => m.productoId === parseInt(productoId));
  res.json(movimientos.map(m => ({ ...m.toJSON(), impacto: m.impacto })));
};

const obtenerMovimiento = (req, res) => {
  const mov = Movimiento.getById(req.params.id);
  if (!mov) return res.status(404).json({ error: `Movimiento ${req.params.id} no encontrado` });
  res.json({ ...mov.toJSON(), impacto: mov.impacto });
};

const crearMovimiento = (req, res) => {
  // Verificar que el producto exista
  const producto = Producto.getById(req.body.productoId);
  if (!producto) return res.status(404).json({ error: `Producto ${req.body.productoId} no encontrado` });

  // Verificar stock suficiente en caso de egreso
  if (req.body.tipo === 'egreso' && producto.stock < parseInt(req.body.cantidad)) {
    return res.status(400).json({ error: `Stock insuficiente. Disponible: ${producto.stock}` });
  }

  // Registrar movimiento
  const nuevo = Movimiento.create({ ...req.body, productoNombre: producto.nombre });

  // Actualizar stock del producto
  const nuevoStock = req.body.tipo === 'ingreso'
    ? producto.stock + parseInt(req.body.cantidad)
    : producto.stock - parseInt(req.body.cantidad);
  Producto.updateStock(producto.id, nuevoStock);

  res.status(201).json({ ...nuevo.toJSON(), impacto: nuevo.impacto });
};

const eliminarMovimiento = (req, res) => {
  const eliminado = Movimiento.delete(req.params.id);
  if (!eliminado) return res.status(404).json({ error: `Movimiento ${req.params.id} no encontrado` });
  res.json({ mensaje: `Movimiento ${req.params.id} eliminado correctamente` });
};

module.exports = { listarMovimientos, obtenerMovimiento, crearMovimiento, eliminarMovimiento };
