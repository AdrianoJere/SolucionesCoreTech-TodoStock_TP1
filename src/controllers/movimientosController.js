const Movimiento = require('../models/Movimiento');
const Producto = require('../models/Producto');

// GET /api/movimientos
const listarMovimientos = async (req, res) => {
  try {
    const filtro = {};
    if (req.query.tipo) filtro.tipo = req.query.tipo;
    if (req.query.productoId) filtro.productoId = req.query.productoId;

    const movimientos = await Movimiento.find(filtro)
      .populate('productoId', 'nombre')
      .sort({ createdAt: -1 });

    res.json(movimientos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// GET /api/movimientos/:id
const obtenerMovimiento = async (req, res) => {
  try {
    const movimiento = await Movimiento.findById(req.params.id).populate('productoId', 'nombre');
    if (!movimiento) {
      return res.status(404).json({ error: 'Movimiento no encontrado' });
    }
    res.json(movimiento);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// POST /api/movimientos
const registrarMovimiento = async (req, res) => {
  try {
    const { productoId, tipo, cantidad, motivo } = req.body;

    // Verificar que el producto existe
    const producto = await Producto.findById(productoId);
    if (!producto) {
      return res.status(404).json({ error: 'Producto no encontrado' });
    }

    // Validar stock suficiente para egreso
    if (tipo === 'egreso' && producto.stock < cantidad) {
      return res.status(400).json({
        error: `Stock insuficiente. Disponible: ${producto.stock}`,
      });
    }

    // Actualizar stock del producto
    const nuevoStock =
      tipo === 'ingreso' ? producto.stock + cantidad : producto.stock - cantidad;

    await Producto.findByIdAndUpdate(productoId, { stock: nuevoStock });

    // Registrar movimiento
    const impacto = tipo === 'ingreso' ? `+${cantidad}` : `-${cantidad}`;
    const movimiento = new Movimiento({
      productoId,
      productoNombre: producto.nombre,
      tipo,
      cantidad,
      motivo: motivo || '',
      impacto,
    });

    await movimiento.save();
    res.status(201).json(movimiento);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// DELETE /api/movimientos/:id
const eliminarMovimiento = async (req, res) => {
  try {
    const movimiento = await Movimiento.findByIdAndDelete(req.params.id);
    if (!movimiento) {
      return res.status(404).json({ error: 'Movimiento no encontrado' });
    }
    res.json({ mensaje: 'Movimiento eliminado correctamente' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  listarMovimientos,
  obtenerMovimiento,
  registrarMovimiento,
  eliminarMovimiento,
};
