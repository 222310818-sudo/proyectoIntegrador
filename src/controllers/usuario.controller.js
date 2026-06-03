/**  
 * controllers/usuario.controllers.js
 * Perfil y gestion de usuarios. 
 * Depende de: models/mysql/Usuario.js, utils/respuesta.js
 * **/

const Usuario = require('../models/mysql/Usuario');
const { ok, error } = require('../utils/respuesta');

const obtenerPerfil = async (req, res, next) => {
    try {
        const { id_usuario } = req.params;
        const usuario = await Usuario.buscarPorId(id_usuario);
        if(!usuario){
            return error(res, 'Usuario no encontrado', 404);
        }
        // no devolver password+hash
        const { password_hash, ...perfil } = usuario;
        return ok(res, perfil);
    } catch(err) {
        next(err);
    }
};

const actualizarPerfil = async (req, res, next) => {
    try {
        const { id_usuario } = req.params;
        const { nombre, apellido_paterno, apellido_materno, discapacidad_visual } = req.body;

        const usuario = await Usuario.buscarPorId(id_usuario);
        if(!usuario) {
            return error(res, 'Usuario no encontrado', 404);
        }

        await Usuario.actualizar(id_usuario, {
            nombre, apellido_paterno, apellido_materno,
            discapacidad_visual,
        });

        return ok(res, { mensaje: 'Perfil actualizado correctamente'});
    } catch(err) {next(err)}
};


const listarAlumnos = async (req, res, next) => {
  try {
    const alumnos = await Usuario.buscarAlumnos();
    return ok(res, alumnos);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  obtenerPerfil,
  actualizarPerfil,
  listarAlumnos
};

module.exports = { obtenerPerfil, actualizarPerfil, listarAlumnos }; 