require('dotenv').config();
const express = require('express');
const path    = require('path');
const { logger } = require('./middleware');

const productosRouter   = require('./routes/productos');
const movimientosRouter = require('./routes/movimientos');
const vistasRouter      = require('./routes/vistas');

const app  = express();
const PORT = process.env.PORT || 3000;

// Motor de plantillas Pug
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, '../views'));

// Middlewares globales
app.use(logger);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '../public')));

// Rutas API
app.use('/api/productos',   productosRouter);
app.use('/api/movimientos', movimientosRouter);

// Rutas vistas
app.use('/', vistasRouter);

// 404
app.use((req, res) => {
  res.status(404).render('pages/error', { mensaje: 'Página no encontrada', codigo: 404 });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Error interno del servidor', detalle: err.message });
});

app.listen(PORT, () => {
  console.log(`✅ TodoStock corriendo en http://localhost:${PORT}`);
  console.log(`   Entorno: ${process.env.NODE_ENV}`);
});

module.exports = app;
