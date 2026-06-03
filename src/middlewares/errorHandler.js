/**
 * middlewares/errorHandler.js
 * Captura errores globales del servidor 
 * Depende de: utils/respuesta.js
*/

const {error } = require('../utils/respuesta');

const errorHandler = (err, req, res, next) => {
    console.error('Error capturado: ', err.message || err ); 

    const status = err.status || err.statusCode || 500 ; 
    const mensaje = err.message || 'Error interno del servidor'; 

    return error(res, mensaje, status);
};

module.exports = {errorHandler}; 

