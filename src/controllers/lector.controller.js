/**
 * controllers/lector.controller.js
 * Devuelve texto extraído para lector de pantalla.
 * Depende de: models/mongo/Documento.model.js, utils/respuesta.js
 */
 
const DocumentoMongo = require('../models/mongo/Documento.model');
const { ok, error }  = require('../utils/respuesta');
 
const leerDocumento = async (req, res, next) => {
  try {
    const { id_documento } = req.params;
 
    const documento = await DocumentoMongo.findOne({
      id_documento_mysql: Number(id_documento),
    });
 
    if (!documento) {
      return error(res, 'Documento no encontrado', 404);
    }
 
    return ok(res, {
      id_documento_mysql: documento.id_documento_mysql,
      nombre_original:    documento.nombre_original,
      texto_extraido:     documento.texto_extraido,
      estructura:         documento.estructura,
      paginas:            documento.paginas,
      metadata:           documento.metadata,
    });
  } catch (err) {
    next(err);
  }
};
 
module.exports = { leerDocumento };