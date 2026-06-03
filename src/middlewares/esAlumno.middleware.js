/**
 * middlewares/esAlumno.middleware.js
 * Bloquea acceso si el usuario no es alumno.
 * Depende de: utils/respuesta.js
 * Debe usarse después de verificarToken.
 */

const { error } = require('../utils/respuesta');

const esAlumno = (req, res, next) => {
  if (!req.usuario || req.usuario.tipo_usuario !== 'alumno') {
    return error(res, 'Acceso restringido a alumnos', 403);
  }
  next();
};

module.exports = { esAlumno };