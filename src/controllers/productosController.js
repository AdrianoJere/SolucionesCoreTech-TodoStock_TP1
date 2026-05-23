const Producto = require('../models/Producto')

// GET /api/productos
const listarProductos = async (req, res) => {
  try {
    const filtro = {}
    if (req.query.estado) filtro.estado = req.query.estado

    const productos = await Producto.find(filtro).sort({ createdAt: -1 })
    res.json(productos)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// GET /api/productos/:id
const obtenerProducto = async (req, res) => {
  try {
    const producto = await Producto.findById(req.params.id)
    if (!producto) {
      return res.status(404).json({ error: 'Producto no encontrado' })
    }
    res.json(producto)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

// POST /api/productos
const crearProducto = async (req, res) => {
  try {
    const { nombre, precio, stock, unidad, lote, vencimiento } = req.body
    const producto = new Producto({
      nombre,
      precio,
      stock,
      unidad,
      lote,
      vencimiento,
    })
    await producto.save()
    res.status(201).json(producto)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

// PATCH /api/productos/:id/stock
const actualizarStock = async (req, res) => {
  try {
    const { stock } = req.body
    if (stock === undefined) {
      return res.status(400).json({ error: 'El campo stock es obligatorio' })
    }
    const producto = await Producto.findByIdAndUpdate(
      req.params.id,
      { stock },
      { new: true, runValidators: true },
    )
    if (!producto) {
      return res.status(404).json({ error: 'Producto no encontrado' })
    }
    res.json(producto)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

// PATCH /api/productos/:id/estado
const actualizarEstado = async (req, res) => {
  try {
    const { estado } = req.body
    if (!['activo', 'inactivo'].includes(estado)) {
      return res
        .status(400)
        .json({ error: 'Estado inválido. Use "activo" o "inactivo"' })
    }
    const producto = await Producto.findByIdAndUpdate(
      req.params.id,
      { estado },
      { new: true },
    )
    if (!producto) {
      return res.status(404).json({ error: 'Producto no encontrado' })
    }
    res.json(producto)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
}

// DELETE /api/productos/:id
const eliminarProducto = async (req, res) => {
  try {
    const producto = await Producto.findByIdAndDelete(req.params.id)
    if (!producto) {
      return res.status(404).json({ error: 'Producto no encontrado' })
    }
    res.json({
      mensaje: `Producto "${producto.nombre}" eliminado correctamente`,
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

module.exports = {
  listarProductos,
  obtenerProducto,
  crearProducto,
  actualizarStock,
  actualizarEstado,
  eliminarProducto,
}
