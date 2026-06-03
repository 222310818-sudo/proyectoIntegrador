const express    = require('express');
const router     = express.Router();
const authController = require('../controllers/auth.controller');

// POST /auth/registro
router.post('/registro', authController.registro);

// POST /auth/login
router.post('/login', authController.login);

module.exports = router;