const express                = require('express');
const router                 = express.Router();
const notificacionController = require('../controllers/notificacion.controller');
const { verificarToken }     = require('../middlewares/auth.middleware');

// GET /notificaciones/:id_usuario — listar por usuario
router.get('/:id_usuario', verificarToken, notificacionController.listar);

// PUT /notificaciones/:id_notificacion/leer — marcar una como leída
router.put('/:id_notificacion/leer', verificarToken, notificacionController.marcarLeida);

// PUT /notificaciones/usuario/:id_usuario/leer-todas — marcar todas como leídas
router.put('/usuario/:id_usuario/leer-todas', verificarToken, notificacionController.marcarTodasLeidas);
module.exports = router;