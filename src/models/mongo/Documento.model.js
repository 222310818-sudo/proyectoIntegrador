const mongoose = require('mongoose');

const DocumentoSchema = new mongoose.Schema({
  id_documento_mysql: {
    type:     Number,
    required: true,
    unique:   true
  },
  id_usuario: {
    type:     Number,
    required: true
  },
  nombre_original: {
    type:     String,
    required: true
  },
  texto_extraido: {
    type:    String,
    default: ''
  },
  estructura: [
    {
      tipo:  { type: String, enum: ['titulo', 'parrafo', 'lista', 'imagen'] },
      texto: { type: String }
    }
  ],
  paginas: [
    {
      numero:    { type: Number },
      contenido: { type: String }
    }
  ],
  metadata: {
    idioma:          { type: String, default: 'es' },
    paginas_totales: { type: Number, default: 0 }
  },
  fecha_subida: {
    type:    Date,
    default: Date.now
  }
}, {
  timestamps: true,
  collection: 'documentos'
});

module.exports = mongoose.model('Documento', DocumentoSchema);