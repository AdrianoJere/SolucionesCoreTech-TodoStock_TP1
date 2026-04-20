const express = require('express');
const router  = express.Router();
const { validarMovimiento } = require('../middleware');
const {
  listarMovimientos, obtenerMovimiento, crearMovimiento, eliminarMovimiento
} = require('../controllers/movimientosController');

router.get('/',                     listarMovimientos);  // ?tipo=ingreso&productoId=1
router.get('/:id',                  obtenerMovimiento);  // ruta dinámica
router.post('/', validarMovimiento, crearMovimiento);
router.delete('/:id',               eliminarMovimiento);

module.exports = router;
