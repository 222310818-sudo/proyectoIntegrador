/**
 * controllers/conversion.controller.js
 * Solicita conversión de documento a audio o braille.
 * Depende de: models/mysql/Conversion.js, models/mongo/SolicitudDetalle.model.js, utils/respuesta.js
 */
 
const Conversion = require('../models/mysql/Conversion');
const SolicitudDetalle = require('../models/mongo/SolicitudDetalle.model');
const { ok, error } = require('../utils/respuesta');
const Documento = require('../models/mysql/Documento');

const solicitar = async(req, res, next) => {
    try {
        const { id_documento, tipo_salida } = req.body;

        if (!id_documento || !tipo_salida){
            return error(res, 'id_documento y tipo_salida deben ser obligatorios', 400);

        }
        if (!['audio', 'braille'].includes(tipo_salida)){
            return error(res, 'tipo_salida debe ser audio o braille', 400);

        }
        // crear registro en mysql
        const resultado = await Conversion.crear({
            id_documento, tipo_salida, 
            estado: 'procesando',
        });

        const id_conversion = resultado.id_conversion;
        
        // crear detalle en mongodb

        await SolicitudDetalle.create({
            id_conversion_mysql: id_conversion, 
            id_documento_mysql: Number(id_documento),
            tipo: tipo_salida,
            estado: 'procesando', 
            audios: [],
            // braille: null,
            fecha_generacion: new Date(),

        });

        return ok(res, { id_conversion, mensaje: 'Conversion iniciada' }, 201);

    } catch (err){
        next(err);
    }
};

const obtenerEstado = async(req, res, next) => {
    try {
    const { id_conversion } = req.params;

    const conversion = await Conversion.buscarPorId(id_conversion);

    if (!conversion) {
      return error(res, 'Conversión no encontrada', 404);
    }

    // 🔐 validar propiedad del documento
    const documento = await Documento.buscarPorId(conversion.id_documento);

    if (documento.id_usuario !== req.usuario.id_usuario) {
      return error(res, 'No autorizado', 403);
    }

    const detalle = await SolicitudDetalle.findOne({
      id_conversion_mysql: Number(id_conversion),
    });

    return ok(res, {
      ...conversion,
      detalle,
    });

  } catch (err) {
    next(err);
  }
};


module.exports = { solicitar, obtenerEstado };