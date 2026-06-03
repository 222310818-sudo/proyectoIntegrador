/**
 * utils/hash.js
 * Encripta y compara contraseñas con bcryptjs.
 * No depende de ningún otro archivo del proyecto.
 */

const bcrypt = require('bcryptjs');

const SALT_ROUNDS = 10;

const hashear = async (password) => {
  return await bcrypt.hash(password, SALT_ROUNDS);
};

const comparar = async (password, hash) => {
  return await bcrypt.compare(password, hash);
};

module.exports = { hashear, comparar };