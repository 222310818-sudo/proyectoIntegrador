/**
 * utils/respuesta.js
 * Helper centralizado para respuestas HTTP estandarizadas.
 * No depende de ningun otro archivo del proyecto
 * **/

/**
 * Respuesa exitosa 
 * @param {object} res - Objetoo reponse de Express
 * @param {*} data -Datos a devolver 
 * @param {nbumber} status - Codigo HTTP (default 200)
 * **/

const ok = (res, data, status = 200) => {
    return res.status(status).json({
        ok:true,
         data, 
    });
};

/**
 * Respuesta de error 
 * @param {object } res - Objeto response de express
 * @param {string} mensaje  - Mensaje de error
 * @param {number} status - Codiugo HTTP (default 400)
 * **/

const error = (res, mensaje, status=400) => {
    return res.status(status).json({
        ok: false, 
        mensaje,
    });
};

module.exports = { ok, error };