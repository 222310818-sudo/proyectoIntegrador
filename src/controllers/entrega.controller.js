/**
 * controllers/entrega.controller.js
 * Entregas de alumnos y calificación de maestros.
 */

const Entrega = require('../models/mysql/Entrega');
const Actividad = require('../models/mysql/Actividad');
const Notificacion = require('../models/mysql/Notificacion');

const { ok, error } = require('../utils/respuesta');

const entregar = async (req, res, next) => {
  try {
    const { id_actividad, id_documento, comentarios } = req.body;
    const id_alumno = req.usuario.id_usuario;

    if (!id_actividad || !id_documento) {
      return error(
        res,
        'Faltan campos obligatorios: id_actividad, id_documento',
        400
      );
    }

    const existente = await Entrega.buscarPorActividadYAlumno(
      id_actividad,
      id_alumno
    );

    if (existente) {
      return error(res, 'Ya existe una entrega para esta actividad', 409);
    }

    const resultado = await Entrega.crear({
      id_actividad,
      id_alumno,
      id_documento,
      comentarios,
      estado: 'entregada',
    });

    const actividadInfo = await Actividad.buscarPorId(id_actividad);

    if (actividadInfo) {
      await Notificacion.crear({
        id_usuario: actividadInfo.id_maestro,
        titulo: 'Nueva entrega',
        mensaje: `Un alumno entregó la actividad: ${actividadInfo.titulo}`,
      });
    }

    return ok(
      res,
      {
        id_entrega: resultado.id_entrega,
        mensaje: 'Entrega registrada correctamente',
      },
      201
    );
  } catch (err) {
    next(err);
  }
};

const calificar = async (req, res, next) => {
  try {
    const { id_entrega } = req.params;
    const { calificacion, comentarios } = req.body;

    if (calificacion === undefined || calificacion === null) {
      return error(res, 'La calificación es obligatoria', 400);
    }

    const entrega = await Entrega.buscarPorId(id_entrega);

    if (!entrega) {
      return error(res, 'Entrega no encontrada', 404);
    }

    await Entrega.calificar(id_entrega, calificacion, comentarios);

    await Notificacion.crear({
      id_usuario: entrega.id_alumno,
      titulo: 'Actividad calificada',
      mensaje: `Tu actividad fue calificada con ${calificacion}.`,
    });

    return ok(res, {
      mensaje: 'Entrega calificada correctamente',
    });
  } catch (err) {
    next(err);
  }
};

const listar = async (req, res, next) => {
  try {
    const { id_actividad } = req.params;

    const entregas = await Entrega.buscarPorActividad(id_actividad);

    return ok(res, entregas);
  } catch (err) {
    next(err);
  }
};

const listarPorAlumno = async (req, res, next) => {
  try {
    const { id_alumno } = req.params;

    const entregas = await Entrega.buscarPorAlumno(id_alumno);

    return ok(res, entregas);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  entregar,
  calificar,
  listar,
  listarPorAlumno,
};