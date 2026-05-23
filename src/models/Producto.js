const mongoose = require('mongoose');

const productoSchema = new mongoose.Schema(
  {
    nombre: {
      type: String,
      required: [true, 'El nombre es obligatorio'],
      trim: true,
    },
    precio: {
      type: Number,
      required: [true, 'El precio es obligatorio'],
      min: [0, 'El precio no puede ser negativo'],
    },
    stock: {
      type: Number,
      required: [true, 'El stock es obligatorio'],
      min: [0, 'El stock no puede ser negativo'],
      default: 0,
    },
    unidad: {
      type: String,
      required: [true, 'La unidad es obligatoria'],
      trim: true,
    },
    lote: {
      type: String,
      required: [true, 'El lote es obligatorio'],
      trim: true,
    },
    vencimiento: {
      type: Date,
      required: [true, 'La fecha de vencimiento es obligatoria'],
    },
    estado: {
      type: String,
      enum: ['activo', 'inactivo'],
      default: 'activo',
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Virtual: stockBajo (menos de 10 unidades)
productoSchema.virtual('stockBajo').get(function () {
  return this.stock < 10;
});

const Producto = mongoose.model('Producto', productoSchema);

module.exports = Producto;
