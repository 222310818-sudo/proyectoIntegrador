/**
 * controllers/trabajo.controller.js
 * Gestión de trabajos personales del usuario.
 * Depende de: models/mysql/TrabajoPersonal.js, utils/respuesta.js
 */

const TrabajoPersonal = require('../models/mysql/TrabajoPersonal');
const { ok, error } = require('../utils/respuesta');

const crear = async (req, res, next) => {
    try{

        const id_usuario = req.usuario.id_usuario;
        const { id_documento, titulo, descripcion } = req.body;
        if(!id_documento || !titulo ){
            return error(res, 'Faltan campos obligatorios: id_documento, titulo', 400);

        }
         const resultado = await TrabajoPersonal.crear({
      id_usuario,
      id_documento,
      titulo,
      descripcion,
      favorito: false,
    });
    
    return ok(res, { id_trabajo: resultado.insertId, mensaje: 'Trabajo personal creado correctamente' }, 201);


    }catch(err){
        next(err);
    }
};

const listar = async (req, res, next) => {
  try {
    const id_usuario = req.usuario.id_usuario; 
    const trabajos = await TrabajoPersonal.listar(id_usuario);
    return ok(res, trabajos);
  } catch (err) {
    next(err);
  }
};
const obtener = async (req, res, next) => {
 try {
    const { id_trabajo } = req.params;

    const trabajo = await TrabajoPersonal.buscarPorId(id_trabajo);

    if (!trabajo) {
      return error(res, 'Trabajo personal no encontrado', 404);
    }

    // 🔐 validación de dueño (TE FALTA ESTO)
    if (trabajo.id_usuario !== req.usuario.id_usuario) {
      return error(res, 'No autorizado', 403);
    }

    return ok(res, trabajo);

  } catch (err) {
    next(err);
  }
};

const toggleFavorito = async (req, res, next) => {
  /*try {
    const { id_trabajo } = req.params;
 
    const trabajo = await TrabajoPersonal.buscarPorId(id_trabajo);
    if (!trabajo) {
      return error(res, 'Trabajo personal no encontrado', 404);
    }
 
    const nuevoEstado = !trabajo.favorito;
    await TrabajoPersonal.toggleFavorito(id_trabajo, nuevoEstado);
 
    return ok(res, { favorito: nuevoEstado, mensaje: `Trabajo ${nuevoEstado ? 'marcado como favorito' : 'quitado de favoritos'}` });
  } catch (err) {
    next(err);
  }*/ 
  try {
    const { id_trabajo } = req.params;

    const trabajo = await TrabajoPersonal.buscarPorId(id_trabajo);
    if (!trabajo) {
      return error(res, 'Trabajo personal no encontrado', 404);
    }

    // 🔐 validación de dueño
    if (trabajo.id_usuario !== req.usuario.id_usuario) {
      return error(res, 'No autorizado', 403);
    }

    const nuevoEstado = !trabajo.favorito;

    await TrabajoPersonal.toggleFavorito(id_trabajo, nuevoEstado);

    return ok(res, {
      favorito: nuevoEstado,
      mensaje: `Trabajo ${nuevoEstado ? 'marcado como favorito' : 'quitado de favoritos'}`
    });

  } catch (err) {
    next(err);
  }
};

const eliminar = async (req, res, next) => {
  /*try {
    const { id_trabajo } = req.params;
 
    const trabajo = await TrabajoPersonal.buscarPorId(id_trabajo);
    if (!trabajo) {
      return error(res, 'Trabajo personal no encontrado', 404);
    }
 
    await TrabajoPersonal.eliminar(id_trabajo);
    return ok(res, { mensaje: 'Trabajo personal eliminado correctamente' });
  } catch (err) {
    next(err);
  }*/
 try {
    const { id_trabajo } = req.params;

    const trabajo = await TrabajoPersonal.buscarPorId(id_trabajo);
    if (!trabajo) {
      return error(res, 'Trabajo personal no encontrado', 404);
    }

    // 🔐 validación de dueño
    if (trabajo.id_usuario !== req.usuario.id_usuario) {
      return error(res, 'No autorizado', 403);
    }

    await TrabajoPersonal.eliminar(id_trabajo);

    return ok(res, {
      mensaje: 'Trabajo personal eliminado correctamente'
    });

  } catch (err) {
    next(err);
  }
};

module.exports = { crear, listar, obtener, toggleFavorito, eliminar };
