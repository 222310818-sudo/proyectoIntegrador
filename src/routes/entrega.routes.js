const express = require('express');
const router = express.Router();

const entregaController = require('../controllers/entrega.controller');
const { verificarToken } = require('../middlewares/auth.middleware');
const { esMaestro } = require('../middlewares/esMaestro.middleware');
const { esAlumno } = require('../middlewares/esAlumno.middleware');

router.post('/', verificarToken, esAlumno, entregaController.entregar);

router.get('/actividad/:id_actividad', verificarToken, entregaController.listar);

router.get('/alumno/:id_alumno', verificarToken, entregaController.listarPorAlumno);

router.put('/:id_entrega/calificar', verificarToken, esMaestro, entregaController.calificar);

module.exports = router;