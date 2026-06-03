const express = require('express');
const router = express.Router();

const documentoController = require('../controllers/documento.controller');
const { upload } = require('../middlewares/upload.middleware');
const { verificarToken } = require('../middlewares/auth.middleware');
const { esMaestro } = require('../middlewares/esMaestro.middleware'); // opcional

// 📄 POST /documentos — subir documento
router.post(
  '/',
  verificarToken,
  // esMaestro,
  upload.single('archivo'),
  documentoController.subir
);

// 📄 GET /documentos
router.get(
  '/',
  verificarToken,
  documentoController.listar
);

// 📄 GET /documentos/usuario/:id_usuario
router.get(
  '/usuario/:id_usuario',
  verificarToken,
  documentoController.listar
);

// 📄 GET /documentos/:id_documento
router.get(
  '/:id_documento',
  verificarToken,
  documentoController.obtener
);
module.exports = router;