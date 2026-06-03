const express              = require('express');
const router               = express.Router();
const conversionController = require('../controllers/conversion.controller');
const { verificarToken }   = require('../middlewares/auth.middleware');

// POST /conversiones — solicitar conversión
router.post('/', verificarToken, conversionController.solicitar);

// GET /conversiones/:id_conversion — obtener estado
router.get('/:id_conversion', verificarToken, conversionController.obtenerEstado);

module.exports = router;