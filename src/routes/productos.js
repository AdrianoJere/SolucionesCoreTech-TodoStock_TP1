const express = require('express');
const router = express.Router();
const {
  listarProductos,
  obtenerProducto,
  crearProducto,
  actualizarStock,
  actualizarEstado,
  eliminarProducto,
} = require('../controllers/productosController');
const { validarProducto } = require('../middleware');

router.get('/', listarProductos);
router.get('/:id', obtenerProducto);
router.post('/', validarProducto, crearProducto);
router.patch('/:id/stock', actualizarStock);
router.patch('/:id/estado', actualizarEstado);
router.delete('/:id', eliminarProducto);

module.exports = router;
