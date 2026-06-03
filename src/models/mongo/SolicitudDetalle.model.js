const mongoose = require('mongoose');

const SolicitudDetalleSchema = new mongoose.Schema({
  id_conversion_mysql: {
    type:     Number,
    required: true,
    index:    true
  },
  id_documento_mysql: {
    type:     Number,
    required: true
  },
  tipo: {
    type:     String,
    enum:     ['audio', 'braille'],
    required: true
  },
  estado: {
    type:    String,
    enum:    ['procesando', 'completado', 'error'],
    default: 'procesando'
  },
  audios: [
    {
      parte:             { type: Number },
      texto:             { type: String },
      ruta:              { type: String },
      duracion_segundos: { type: Number }
    }
  ],
  braille: {
    formato:   { type: String, enum: ['grado1', 'grado2'] },
    contenido: { type: String }
  },
  fecha_generacion: {
    type:    Date,
    default: Date.now
  }
}, {
  timestamps: true,
  collection: 'solicitudes_detalle'
});

SolicitudDetalleSchema.index({ id_conversion_mysql: 1 });

module.exports = mongoose.model('SolicitudDetalle', SolicitudDetalleSchema);