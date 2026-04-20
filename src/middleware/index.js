// Middlewares personalizados

const logger = (req, res, next) => {
  const ahora = new Date().toISOString();
  console.log(`[${ahora}] ${req.method} ${req.url}`);
  next();
};

const validarProducto = (req, res, next) => {
  const { nombre, precio, stock, unidad, lote, vencimiento } = req.body;
  if (!nombre || precio === undefined || stock === undefined || !unidad || !lote || !vencimiento) {
    return res.status(400).json({
      error: 'Faltan campos obligatorios: nombre, precio, stock, unidad, lote, vencimiento'
    });
  }
  if (isNaN(precio) || precio < 0) {
    return res.status(400).json({ error: 'El precio debe ser un número positivo' });
  }
  if (isNaN(stock) || stock < 0) {
    return res.status(400).json({ error: 'El stock debe ser un número positivo' });
  }
  next();
};

const validarMovimiento = (req, res, next) => {
  const { productoId, tipo, cantidad } = req.body;
  if (!productoId || !tipo || cantidad === undefined) {
    return res.status(400).json({
      error: 'Faltan campos obligatorios: productoId, tipo, cantidad'
    });
  }
  if (!['ingreso', 'egreso'].includes(tipo)) {
    return res.status(400).json({ error: 'Tipo inválido. Valores permitidos: ingreso, egreso' });
  }
  if (isNaN(cantidad) || cantidad <= 0) {
    return res.status(400).json({ error: 'La cantidad debe ser un número mayor a 0' });
  }
  next();
};

module.exports = { logger, validarProducto, validarMovimiento };
