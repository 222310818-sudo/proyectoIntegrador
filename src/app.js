const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { errorHandler } = require('./middlewares/errorHandler');

const authRoutes = require('./routes/auth.routes');
const usuarioRoutes = require('./routes/usuario.routes');
const documentoRoutes = require('./routes/documento.routes');
const conversionRoutes = require('./routes/conversion.routes');
const actividadRoutes = require('./routes/actividad.routes');
const entregaRoutes = require('./routes/entrega.routes');
const notificacionRoutes = require('./routes/notificacion.routes');
const trabajoRoutes = require('./routes/trabajo.routes');
const lectorRoutes = require('./routes/lector.routes');
const audioRoutes = require('./routes/audio.routes');

const path = require('path');

const app = express();
app.use('/uploads', express.static(path.join(process.cwd(), 'src', 'uploads')));

const cors = require('cors');

app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://lumina-touch-guide.vercel.app'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.json({ ok: true, mensaje: 'API Lumina funcionando' });
});

app.use('/auth', authRoutes);
app.use('/usuarios', usuarioRoutes);
app.use('/documentos', documentoRoutes);
app.use('/conversiones', conversionRoutes);
app.use('/actividades', actividadRoutes);
app.use('/entregas', entregaRoutes);
app.use('/notificaciones', notificacionRoutes);
app.use('/trabajos', trabajoRoutes);
app.use('/lector', lectorRoutes);
app.use('/audio', audioRoutes);

app.use(errorHandler);

module.exports = app;