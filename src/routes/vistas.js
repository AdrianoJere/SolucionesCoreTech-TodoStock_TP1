const express = require('express');
const router = express.Router();
const Producto = require('../models/Producto');
const Movimiento = require('../models/Movimiento');

// GET / — Lista de productos
router.get('/', async (req, res) => {
  try {
    const productos = await Producto.find().sort({ createdAt: -1 });
    res.render('pages/index', { titulo: 'TodoStock — Productos', productos });
  } catch (error) {
    res.status(500).render('pages/error', { mensaje: error.message });
  }
});

// GET /productos/:id — Detalle de producto con movimientos
router.get('/productos/:id', async (req, res) => {
  try {
    const producto = await Producto.findById(req.params.id);
    if (!producto) {
      return res.status(404).render('pages/error', { mensaje: 'Producto no encontrado' });
    }
    const movimientos = await Movimiento.find({ productoId: producto._id }).sort({
      createdAt: -1,
    });
    res.render('pages/detalleProducto', {
      titulo: `Detalle — ${producto.nombre}`,
      producto,
      movimientos,
    });
  } catch (error) {
    res.status(500).render('pages/error', { mensaje: error.message });
  }
});

// GET /movimientos — Lista de movimientos
router.get('/movimientos', async (req, res) => {
  try {
    const movimientos = await Movimiento.find()
      .populate('productoId', 'nombre')
      .sort({ createdAt: -1 });
    res.render('pages/movimientos', { titulo: 'TodoStock — Movimientos', movimientos });
  } catch (error) {
    res.status(500).render('pages/error', { mensaje: error.message });
  }
});

module.exports = router;
