const mongoose = require('mongoose');

const movimientoSchema = new mongoose.Schema(
  {
    productoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Producto',
      required: [true, 'El productoId es obligatorio'],
    },
    productoNombre: {
      type: String,
      trim: true,
    },
    tipo: {
      type: String,
      enum: ['ingreso', 'egreso'],
      required: [true, 'El tipo es obligatorio (ingreso o egreso)'],
    },
    cantidad: {
      type: Number,
      required: [true, 'La cantidad es obligatoria'],
      min: [1, 'La cantidad debe ser al menos 1'],
    },
    motivo: {
      type: String,
      trim: true,
      default: '',
    },
    impacto: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// Virtual: impacto calculado
movimientoSchema.virtual('impactoCalculado').get(function () {
  return this.tipo === 'ingreso' ? `+${this.cantidad}` : `-${this.cantidad}`;
});

const Movimiento = mongoose.model('Movimiento', movimientoSchema);

module.exports = Movimiento;
