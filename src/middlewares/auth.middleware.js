/**
 * middlewares/auth.middleware.js
 * Verifica JWT en headers de cada request.
 * Depende de: utils/jwt.js, utils/respuesta.js
 */

const { verificar } = require('../utils/jwt');
const { error }     = require('../utils/respuesta');

const verificarToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return error(res, 'Token no proporcionado', 401);
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = verificar(token);
    req.usuario = payload;
    next();
  } catch (err) {
    return error(res, 'Token inválido o expirado', 401);
  }
};

module.exports = { verificarToken };