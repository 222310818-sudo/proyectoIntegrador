/**
 * controllers/documento.controller.js
 * Subida y consulta de documentos.
 * Depende de: models/mysql/Documento.js, models/mongo/Documento.model.js, utils/respuesta.js
 */

const Documento = require('../models/mysql/Documento');
const DocumentoMongo = require('../models/mongo/Documento.model');
const { ok, error } = require('../utils/respuesta');

const fs = require('fs');
const pdfParse = require('pdf-parse');

const path = require('path'); 
// subir 
const subir = async (req, res, next) => {
    try {
        if(!req.file) {
            return error(res, 'No se recibio ningun archivo', 400);
        }

        const id_usuario = req.usuario.id_usuario; // ✅ del token

        const ext = path.extname(req.file.originalname).toLowerCase();
        const tamanio_kb = Math.round(req.file.size / 1024);

        let textoExtraido = '';
        let paginasTotales = 0;

            if (ext === '.pdf') {
                  const buffer = fs.readFileSync(req.file.path);
                  const data = await pdfParse(buffer);

                     textoExtraido = data.text || '';
                     paginasTotales = data.numpages || 0;
            }

        const resultado = await Documento.crear({
            id_usuario,
            nombre_original: req.file.originalname,
            nombre_archivo: req.file.filename,
            tipo_archivo: req.file.mimetype,
            extension: ext,
            tamanio_kb,
            estado_procesamiento: 'pendiente',
        });

        const id_documento = resultado.id_documento;

       await DocumentoMongo.create({
             id_documento_mysql: id_documento,
             id_usuario: Number(id_usuario),
             nombre_original: req.file.originalname,
             texto_extraido: textoExtraido,
             estructura: [],
             paginas: [],
             metadata: {
             idioma: 'es',
             paginas_totales: paginasTotales,
        },
            fecha_subida: new Date(),
        });

        return ok(res, { id_documento, mensaje: 'Documento subido correctamente' }, 201);

    } catch(err) {
        next(err);
    }
};
const listar = async (req, res, next) => {
    try {

        const id_usuario = req.usuario.id_usuario;

        const documentos = await Documento.buscarPorUsuario(id_usuario);

        return ok(res, documentos);

    } catch (err) {
        next(err);
    }
};
// listar 
const obtener = async (req, res, next) => {
    try {
        const { id_documento } = req.params;
        const documento = await Documento.buscarPorId(id_documento);
        if (!documento) {
            return error(res, 'Docuemtno no encontrado', 404);
        }

        //traer tambien el contenido de mongo
        const contenido = await DocumentoMongo.findOne({ id_documento_mysql: Number(id_documento) });
        return ok(res, { ...documento, contenido });
    }catch(err) {
        next(err);
    }
};

module.exports = { subir, listar, obtener };
