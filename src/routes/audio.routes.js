const express         = require('express');
const router          = express.Router();
const audioController = require('../controllers/audio.controller');
const { verificarToken } = require('../middlewares/auth.middleware');


// GET /audio/:id_conversion — obtener lista de audios
router.get('/:id_conversion', verificarToken, audioController.obtenerAudios);

// GET /audio/:id_conversion/:parte — stream de una parte del audio
router.get('/:id_conversion/:parte', verificarToken, audioController.streamAudio);

module.exports = router;