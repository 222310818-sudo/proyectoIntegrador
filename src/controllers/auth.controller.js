/**
 * contorollers/auth.controller.js
 * Registro y login de usuarios 
 * Depende de: models/mysql/Usuario.js, utils/respuesta.js
 * (utils/hash.js y utils/jwt.js se integran al final con auth)
**/

const Usuario = require('../models/mysql/Usuario');
const { hashear, comparar } = require('../utils/hash');
const { generar }           = require('../utils/jwt');
const { ok, error } = require('../utils/respuesta');

const registro = async (req, res, next ) => {
    try {
        const { nombre, apellido_paterno, apellido_materno, email, password, tipo_usuario, discapacidad_visual } = req.body;

        if (!nombre || !email || !password || !tipo_usuario) {
            return error(res, 'Faltan campos obligatorios: nombre, email, password, tipo_usuario', 400);

        }
        const existente = await Usuario.buscarPorEmail(email);
        if (existente) {
            return error(res, 'El email ya esta registrado', 409);
        }
        
        const password_hash = await hashear(password);

        // TODO: cuando se integre auth > const hash = await hashear(password)

        const nuevoUsuario = await Usuario.crear({
            nombre, apellido_paterno, apellido_materno,
            email, password_hash,
            tipo_usuario,
            discapacidad_visual: discapacidad_visual ?? true,

        });
        
        return ok(res, { id_usuario: nuevoUsuario.id_usuario}, 201);

    } catch (err) {
        next(err);
    }
};

const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password ) {
            return error(res, 'Email y password son obligatorios', 400);
        }

        const usuario = await Usuario.buscarPorEmail(email);
        if(!usuario) {
            return error(res, 'Credenciales incorrectas', 401);
        }
        // TODO: cuando se integre auth > const valido = await comparar(password, usuario.password_hash);
        const valido = await comparar(password, usuario.password_hash); // temporal sin bcrypt por ahora
        if (!valido) {
            return error(res, 'Credenciales incorrectas', 401)
        }
        // TODO: cuando se integre auth > const token = generar({id_usuario, tipo_usuario})
        const token = generar({
         id_usuario:   usuario.id_usuario,
         tipo_usuario: usuario.tipo_usuario,
         nombre:       usuario.nombre,
        });

        return ok(res, {
            token,
            usuario: {
                id_usuario:   usuario.id_usuario,
                nombre:       usuario.nombre,
                tipo_usuario: usuario.tipo_usuario,
            },
        });
    } catch (err) {
        next(err);
    }
};

module.exports = { registro, login }; 