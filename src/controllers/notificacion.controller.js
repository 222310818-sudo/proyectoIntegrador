/**
 * controllers/notificacion.controller.js
 * Lista y marca notificaciones como leídas.
 * Depende de: models/mysql/Notificacion.js, utils/respuesta.js
 */
const Notificacion = require('../models/mysql/Notificacion');
const { ok, error } = require('../utils/respuesta');

const listar = async (req, res, next) => {
    try{
        const { id_usuario } = req.params;

        const notificaciones = await Notificacion.listarPorUsuario(id_usuario);
        return ok(res, notificaciones);
    }catch(err){
        next(err);
    }
};

const marcarLeida = async (req, res, next) => {
    try{
        const { id_notificacion } = req.params;

        const notificacion = await Notificacion.buscarPorId(id_notificacion);

        if(!notificacion){
            return error(res, 'Notificacion no encontrada', 404);
        }

        await Notificacion.marcarLeida(id_notificacion);
        return ok(res, { mensaje: 'Notificacion marcada como leida' });
    }catch(err){
        next(err);
    }
};

const marcarTodasLeidas = async (req, res, next) => {
    try{
        const { id_usuario } = req.params;

        await Notificacion.marcarTodasLeidas(id_usuario);
        return ok(res, { mensaje: 'Todas las notificaciones marcadas como leidas' });

    }catch(err){
        next(err);
    }
};

module.exports = { listar, marcarLeida, marcarTodasLeidas };
