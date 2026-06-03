/**
 * controllers/audio.controller.js
 * Sirve archivos de audio generados por conversión.
 * Depende de: models/mongo/SolicitudDetalle.model.js, utils/respuesta.js
 */
 
const SolicitudDetalle = require('../models/mongo/SolicitudDetalle.model');
const Conversion = require('../models/mysql/Conversion');
const Documento = require('../models/mysql/Documento');
const { ok, error }    = require('../utils/respuesta');
const path             = require('path');
const fs               = require('fs');
 
const obtenerAudios = async (req, res, next) => {
  try {
    const { id_conversion } = req.params;

    const solicitud = await SolicitudDetalle.findOne({
      id_conversion_mysql: Number(id_conversion),
    });

    if (!solicitud) {
      return error(res, 'Conversión no encontrada', 404);
    }

    if (solicitud.tipo !== 'audio') {
      return error(res, 'Esta conversión no es de tipo audio', 400);
    }

    if (solicitud.estado !== 'completado') {
      return error(res, `La conversión aún no está lista. Estado: ${solicitud.estado}`, 400);
    }

    // 🔐 validación de dueño (RECOMENDADO)
    const conversion = await Conversion.buscarPorId(id_conversion);
    const documento = await Documento.buscarPorId(conversion.id_documento);

    if (documento.id_usuario !== req.usuario.id_usuario) {
      return error(res, 'No autorizado', 403);
    }

    return ok(res, {
      id_conversion_mysql: solicitud.id_conversion_mysql,
      estado: solicitud.estado,
      audios: solicitud.audios,
    });

  } catch (err) {
    next(err);
  }
};
 
const streamAudio = async (req, res, next) => {
  try {
    const { id_conversion, parte } = req.params;

    const solicitud = await SolicitudDetalle.findOne({
      id_conversion_mysql: Number(id_conversion),
    });

    if (!solicitud) {
      return error(res, 'Conversión no encontrada', 404);
    }

    const audio = solicitud.audios.find(
      a => a.parte === Number(parte)
    );

    if (!audio) {
      return error(res, `Parte ${parte} no encontrada`, 404);
    }

    // 🔐 validación de dueño
    const conversion = await Conversion.buscarPorId(id_conversion);
    const documento = await Documento.buscarPorId(conversion.id_documento);

    if (documento.id_usuario !== req.usuario.id_usuario) {
      return error(res, 'No autorizado', 403);
    }

    const ruta = path.resolve(audio.ruta);

    if (!fs.existsSync(ruta)) {
      return error(res, 'Archivo de audio no disponible', 404);
    }

    res.setHeader('Content-Type', 'audio/mpeg');
    res.setHeader('Content-Disposition', `inline; filename="parte_${parte}.mp3"`);

    fs.createReadStream(ruta).pipe(res);

  } catch (err) {
    next(err);
  }
};
 
module.exports = { obtenerAudios, streamAudio };