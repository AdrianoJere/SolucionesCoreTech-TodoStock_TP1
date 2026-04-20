// Controlador de Productos
const Producto = require('../models/Producto');

const listarProductos = (req, res) => {
  const { estado } = req.query;
  let productos = estado
    ? Producto.getAll().filter(p => p.estado === estado)
    : Producto.getAll();
  res.json(productos.map(p => ({ ...p.toJSON(), stockBajo: p.stockBajo })));
};

const obtenerProducto = (req, res) => {
  const producto = Producto.getById(req.params.id);
  if (!producto) return res.status(404).json({ error: `Producto ${req.params.id} no encontrado` });
  res.json({ ...producto.toJSON(), stockBajo: producto.stockBajo });
};

const crearProducto = (req, res) => {
  const nuevo = Producto.create(req.body);
  res.status(201).json(nuevo.toJSON());
};

const actualizarStock = (req, res) => {
  const { stock } = req.body;
  if (stock === undefined || isNaN(stock) || stock < 0)
    return res.status(400).json({ error: 'Stock inválido' });
  const producto = Producto.updateStock(req.params.id, parseInt(stock));
  if (!producto) return res.status(404).json({ error: `Producto ${req.params.id} no encontrado` });
  res.json(producto.toJSON());
};

const actualizarEstado = (req, res) => {
  const { estado } = req.body;
  if (!['activo', 'inactivo'].includes(estado))
    return res.status(400).json({ error: 'Estado inválido. Valores: activo, inactivo' });
  const producto = Producto.updateEstado(req.params.id, estado);
  if (!producto) return res.status(404).json({ error: `Producto ${req.params.id} no encontrado` });
  res.json(producto.toJSON());
};

const eliminarProducto = (req, res) => {
  const eliminado = Producto.delete(req.params.id);
  if (!eliminado) return res.status(404).json({ error: `Producto ${req.params.id} no encontrado` });
  res.json({ mensaje: `Producto ${req.params.id} eliminado correctamente` });
};

module.exports = { listarProductos, obtenerProducto, crearProducto, actualizarStock, actualizarEstado, eliminarProducto };
