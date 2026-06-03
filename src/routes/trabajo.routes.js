const express           = require('express');
const router            = express.Router();
const trabajoController = require('../controllers/trabajo.controller');
const { verificarToken } = require('../middlewares/auth.middleware');

// POST /trabajos — crear trabajo personal
router.post('/', verificarToken, trabajoController.crear);

// GET /trabajos/usuario/:id_usuario — listar por usuario
router.get('/usuario/:id_usuario', verificarToken, trabajoController.listar);

// GET /trabajos/:id_trabajo — obtener uno
router.get('/:id_trabajo', verificarToken, trabajoController.obtener);

// PUT /trabajos/:id_trabajo/favorito — toggle favorito
router.put('/:id_trabajo/favorito', verificarToken, trabajoController.toggleFavorito);

// DELETE /trabajos/:id_trabajo — eliminar
router.delete('/:id_trabajo', verificarToken, trabajoController.eliminar);

module.exports = router;