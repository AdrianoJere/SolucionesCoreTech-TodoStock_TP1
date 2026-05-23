// Middleware de logging
const logger = (req, res, next) => {
  const timestamp = new Date().toISOString()
  console.log(`[${timestamp}] ${req.method} ${req.url}`)
  next()
}

// Validación de campos obligatorios para crear producto
const validarProducto = (req, res, next) => {
  const { nombre, precio, stock, unidad, lote, vencimiento } = req.body
  const faltantes = []

  if (!nombre) faltantes.push('nombre')
  if (precio === undefined) faltantes.push('precio')
  if (stock === undefined) faltantes.push('stock')
  if (!unidad) faltantes.push('unidad')
  if (!lote) faltantes.push('lote')
  if (!vencimiento) faltantes.push('vencimiento')

  if (faltantes.length > 0) {
    return res.status(400).json({
      error: `Campos obligatorios faltantes: ${faltantes.join(', ')}`,
    })
  }

  next()
}

// Validación de campos obligatorios para registrar movimiento
const validarMovimiento = (req, res, next) => {
  const { productoId, tipo, cantidad } = req.body
  const faltantes = []

  if (!productoId) faltantes.push('productoId')
  if (!tipo) faltantes.push('tipo')
  if (cantidad === undefined) faltantes.push('cantidad')

  if (faltantes.length > 0) {
    return res.status(400).json({
      error: `Campos obligatorios faltantes: ${faltantes.join(', ')}`,
    })
  }

  if (!['ingreso', 'egreso'].includes(tipo)) {
    return res.status(400).json({
      error: 'El tipo debe ser "ingreso" o "egreso"',
    })
  }

  if (cantidad < 1) {
    return res.status(400).json({
      error: 'La cantidad debe ser al menos 1',
    })
  }

  next()
}

// Manejo centralizado de errores
const manejarErrores = (err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ error: 'Error interno del servidor' })
}

module.exports = { logger, validarProducto, validarMovimiento, manejarErrores }
