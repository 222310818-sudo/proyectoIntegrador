const express          = require('express');
const router           = express.Router();
const lectorController = require('../controllers/lector.controller');
const { verificarToken } = require('../middlewares/auth.middleware');


// GET /lector/:id_documento — obtener texto para lector de pantalla
router.get('/:id_documento', verificarToken, lectorController.leerDocumento);

module.exports = router;