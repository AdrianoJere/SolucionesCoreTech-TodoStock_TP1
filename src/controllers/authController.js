const Usuario = require('../models/Usuario');
const jwt = require('jsonwebtoken');

// Genera un token JWT firmado con el id y rol del usuario
const generarToken = (id, rol) => {
  return jwt.sign({ id, rol }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '8h',
  });
};

// POST /api/auth/register
const register = async (req, res) => {
  try {
    const { nombre, email, password, rol } = req.body;

    const existe = await Usuario.findOne({ email });
    if (existe) {
      return res.status(400).json({ error: 'El email ya está registrado' });
    }

    const usuario = await Usuario.create({ nombre, email, password, rol });
    const token = generarToken(usuario._id, usuario.rol);

    res.status(201).json({
      mensaje: 'Usuario registrado correctamente',
      token,
      usuario: {
        id: usuario._id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol,
      },
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const mensajes = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({ error: mensajes.join(', ') });
    }
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email y contraseña son obligatorios' });
    }

    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const passwordValida = await usuario.compararPassword(password);
    if (!passwordValida) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    const token = generarToken(usuario._id, usuario.rol);

    res.status(200).json({
      mensaje: 'Login exitoso',
      token,
      usuario: {
        id: usuario._id,
        nombre: usuario.nombre,
        email: usuario.email,
        rol: usuario.rol,
      },
    });
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

// GET /api/auth/perfil — ruta protegida de ejemplo
const perfil = async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.usuario.id).select('-password');
    res.status(200).json({ usuario });
  } catch (error) {
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

module.exports = { register, login, perfil };
