const jwt = require('jsonwebtoken');

//  Middleware: verifica token JWT 
// Uso: agregar como segundo argumento en las rutas que se quieran proteger
const verifyToken = (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer <token>

    if (!token) {
      return res.status(401).json({ error: 'Acceso denegado. Token no proporcionado' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.usuario = decoded; // { id, rol, iat, exp }
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expirado. Volvé a iniciar sesión' });
    }
    return res.status(403).json({ error: 'Token inválido' });
  }
};

//  Middleware: restringe acceso solo a rol admin ─
// Debe usarse DESPUÉS de verifyToken
const soloAdmin = (req, res, next) => {
  if (req.usuario.rol !== 'admin') {
    return res.status(403).json({ error: 'Acceso restringido a administradores' });
  }
  next();
};

module.exports = { verifyToken, soloAdmin };
