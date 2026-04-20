const express  = require('express');
const router   = express.Router();
const Producto = require('../models/Producto');
const Movimiento = require('../models/Movimiento');

// Inicio - listado de productos
router.get('/', (req, res) => {
  const productos = Producto.getAll().map(p => ({ ...p.toJSON(), stockBajo: p.stockBajo }));
  res.render('pages/index', { titulo: 'Productos — TodoStock S.A.', productos });
});

// Detalle de producto (ruta dinámica)
router.get('/productos/:id', (req, res) => {
  const producto = Producto.getById(req.params.id);
  if (!producto) return res.render('pages/error', { mensaje: 'Producto no encontrado', codigo: 404 });
  const movimientos = Movimiento.getByProducto(req.params.id).map(m => ({ ...m.toJSON(), impacto: m.impacto }));
  res.render('pages/detalleProducto', {
    titulo: producto.nombre,
    producto: { ...producto.toJSON(), stockBajo: producto.stockBajo },
    movimientos
  });
});

// Listado de movimientos
router.get('/movimientos', (req, res) => {
  const movimientos = Movimiento.getAll().map(m => ({ ...m.toJSON(), impacto: m.impacto }));
  res.render('pages/movimientos', { titulo: 'Movimientos de Stock', movimientos });
});

module.exports = router;
