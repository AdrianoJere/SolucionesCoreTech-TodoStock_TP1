const express = require('express');
const router = express.Router();
const {
  listarMovimientos,
  obtenerMovimiento,
  registrarMovimiento,
  eliminarMovimiento,
} = require('../controllers/movimientosController');
const { validarMovimiento } = require('../middleware');

router.get('/', listarMovimientos);
router.get('/:id', obtenerMovimiento);
router.post('/', validarMovimiento, registrarMovimiento);
router.delete('/:id', eliminarMovimiento);

module.exports = router;
