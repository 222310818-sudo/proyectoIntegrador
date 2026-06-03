const express          = require('express');
const router           = express.Router();
const usuarioController = require('../controllers/usuario.controller');
const { verificarToken } = require('../middlewares/auth.middleware');
// GET /usuarios/:id_usuario
router.get('/:id_usuario', verificarToken, usuarioController.obtenerPerfil);
// PUT /usuarios/:id_usuario
router.put('/:id_usuario', verificarToken, usuarioController.actualizarPerfil);

router.get('/alumnos/listar', verificarToken, usuarioController.listarAlumnos);
module.exports = router;