/**
 * controllers/actividad.controller.js
 * CRUD de actividades
 */

const Actividad = require('../models/mysql/Actividad');
const { ok, error } = require('../utils/respuesta');

const Notificacion = require('../models/mysql/Notificacion');
const Usuario = require('../models/mysql/Usuario');

const crear = async (req, res, next) => {
  try {
    const {
      id_documento,
      id_alumno,
      titulo,
      instrucciones,
      fecha_vencimiento,
      puntos_totales
    } = req.body;

    const id_maestro = req.usuario.id_usuario;

    if (
      !id_documento ||
      !titulo ||
      !instrucciones ||
      !fecha_vencimiento ||
      !puntos_totales
    ) {
      return error(
        res,
        'Faltan campos obligatorios: id_documento, titulo, fecha_vencimiento, puntos_totales',
        400
      );
    }

    const resultado = await Actividad.crear({
      id_maestro,
      id_alumno: id_alumno || null,
      id_documento,
      titulo,
      instrucciones,
      fecha_vencimiento,
      puntos_totales,
      estado: 'activa',
    });

    if (id_alumno) {
  await Notificacion.crear({
    id_usuario: id_alumno,
    titulo: 'Nueva actividad',
    mensaje: `Se te asignó la actividad: ${titulo}`,
  });
} else {
  const alumnos = await Usuario.buscarAlumnos();

  for (const alumno of alumnos) {
    await Notificacion.crear({
      id_usuario: alumno.id_usuario,
      titulo: 'Nueva actividad',
      mensaje: `Se publicó la actividad: ${titulo}`,
    });
  }
}

    return ok(
      res,
      {
        id_actividad: resultado.id_actividad,
        mensaje: 'Actividad creada correctamente',
      },
      201
    );
  } catch (err) {
    next(err);
  }
};

const listar = async (req, res, next) => {
  try {
    const { id_usuario, tipo_usuario } = req.usuario;

    let actividades;

    if (tipo_usuario === 'maestro') {
      actividades = await Actividad.listar(id_usuario);
    } else {
      actividades = await Actividad.listarActivas(id_usuario);
    }

    return ok(res, actividades);
  } catch (err) {
    next(err);
  }
};

const obtener = async (req, res, next) => {
  try {
    const { id_actividad } = req.params;

    const actividad = await Actividad.buscarPorId(id_actividad);

    if (!actividad) {
      return error(res, 'Actividad no encontrada', 404);
    }

    return ok(res, actividad);
  } catch (err) {
    next(err);
  }
};

const cerrar = async (req, res, next) => {
  try {
    const { id_actividad } = req.params;

    const actividad = await Actividad.buscarPorId(id_actividad);

   if (actividad.id_alumno) {
  await Notificacion.crear({
    id_usuario: actividad.id_alumno,
    titulo: 'Actividad cerrada',
    mensaje: `La actividad "${actividad.titulo}" fue cerrada.`,
  });
}

    if (!actividad) {
      return error(res, 'Actividad no encontrada', 404);
    }

    if (actividad.estado === 'cerrada') {
      return error(res, 'La actividad ya está cerrada', 400);
    }

    await Actividad.cerrar(id_actividad);

    return ok(res, {
      mensaje: 'Actividad cerrada correctamente',
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  crear,
  listar,
  obtener,
  cerrar,
};