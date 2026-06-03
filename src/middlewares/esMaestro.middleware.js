const esMaestro = (req, res, next) => {
  if (!req.usuario || req.usuario.tipo_usuario !== 'maestro') {
    return res.status(403).json({
      ok: false,
      mensaje: 'Acceso restringido a maestros'
    });
  }

  next();
};

module.exports = { esMaestro };