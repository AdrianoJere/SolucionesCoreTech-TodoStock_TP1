const express = require('express');
const path = require('path');
require('dotenv').config();

const conectarDB = require('./config/db');
const { logger, manejarErrores } = require('./middleware');

const productosRouter = require('./routes/productos');
const movimientosRouter = require('./routes/movimientos');
const vistasRouter = require('./routes/vistas');

const app = express();

// Conexión a MongoDB
conectarDB();

// Motor de plantillas
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, '../views'));

// Middlewares globales
app.use(express.json());
app.use(express.static(path.join(__dirname, '../public')));
app.use(logger);

// Rutas API
app.use('/api/productos', productosRouter);
app.use('/api/movimientos', movimientosRouter);

// Rutas de vistas
app.use('/', vistasRouter);

// Manejo de errores
app.use(manejarErrores);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
});

module.exports = app;
