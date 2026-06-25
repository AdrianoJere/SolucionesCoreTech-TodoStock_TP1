const express = require('express');
const router = express.Router();
const { register, login, perfil } = require('../controllers/authController');
const { verifyToken } = require('../middleware/auth');

// Rutas públicas (no requieren token)
router.post('/register', register);
router.post('/login', login);

// Ruta protegida - requiere token válido
router.get('/perfil', verifyToken, perfil);

module.exports = router;
