const express = require('express');
const router  = express.Router();
const { validarProducto } = require('../middleware');
const {
  listarProductos, obtenerProducto, crearProducto,
  actualizarStock, actualizarEstado, eliminarProducto
} = require('../controllers/productosController');

router.get('/',                  listarProductos);   // ?estado=activo
router.get('/:id',               obtenerProducto);   // ruta dinámica
router.post('/', validarProducto, crearProducto);
router.patch('/:id/stock',       actualizarStock);
router.patch('/:id/estado',      actualizarEstado);
router.delete('/:id',            eliminarProducto);

module.exports = router;
