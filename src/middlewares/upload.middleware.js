const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadDir = path.join(process.cwd(), 'src', 'uploads');

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },

  filename: (req, file, cb) => {
    const timestamp = Date.now();
    const ext = path.extname(file.originalname);
    const nombre = path
      .basename(file.originalname, ext)
      .replace(/\s+/g, '_');

    cb(null, `${nombre}_${timestamp}${ext}`);
  },
});

const filtroArchivos = (req, file, cb) => {
  const tiposPermitidos = ['.pdf', '.docx', '.txt'];
  const ext = path.extname(file.originalname).toLowerCase();

  if (tiposPermitidos.includes(ext)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        `Tipo de archivo no permitido. Solo se aceptan: ${tiposPermitidos.join(', ')}`
      )
    );
  }
};

const upload = multer({
  storage,
  fileFilter: filtroArchivos,
  limits: {
    fileSize: 10 * 1024 * 1024,
  },
});

module.exports = { upload };