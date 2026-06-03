/**
 * utils/jwt.js
 * Genera y verifica tokens JWT.
 * No depende de ningún otro archivo del proyecto.
 */

const jwt = require('jsonwebtoken');

const SECRET = process.env.JWT_SECRET;

const generar = (payload) => {
  return jwt.sign(payload, SECRET, { expiresIn: '24h' });
};

const verificar = (token) => {
  return jwt.verify(token, SECRET);
};

module.exports = { generar, verificar };