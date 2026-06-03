const express = require('express');
const router = express.Router();

const actividadController = require('../controllers/actividad.controller');
const { verificarToken } = require('../middlewares/auth.middleware');
const { esMaestro } = require('../middlewares/esMaestro.middleware');

router.post('/', verificarToken, esMaestro, actividadController.crear);

router.get('/', verificarToken, actividadController.listar);

router.get('/:id_actividad', verificarToken, actividadController.obtener);

router.put('/:id_actividad/cerrar', verificarToken, esMaestro, actividadController.cerrar);

module.exports = router;