const db = require('../../config/mysql');

/**
 * Crear documento
 */
async function crear(documento) {
  const {
    id_usuario,
    nombre_original,
    nombre_archivo,
    tipo_archivo,
    extension,
    tamanio_kb
  } = documento;

  const [result] = await db.query(
    `INSERT INTO documento 
    (id_usuario, nombre_original, nombre_archivo, tipo_archivo, extension, tamanio_kb)
    VALUES (?, ?, ?, ?, ?, ?)`,
    [
      id_usuario,
      nombre_original,
      nombre_archivo,
      tipo_archivo,
      extension,
      tamanio_kb
    ]
  );

  return {
    id_documento: result.insertId,
    ...documento
  };
}

/**
 * Buscar por ID
 */
async function buscarPorId(id_documento) {
  const [rows] = await db.query(
    `SELECT * FROM documento WHERE id_documento = ? LIMIT 1`,
    [id_documento]
  );

  return rows[0] || null;
}

/**
 * Buscar documentos por usuario
 */
async function buscarPorUsuario(id_usuario) {
  const [rows] = await db.query(
    `SELECT * FROM documento 
     WHERE id_usuario = ? 
     ORDER BY fecha_subida DESC`,
    [id_usuario]
  );

  return rows;
}

/**
 * Actualizar estado del documento
 */
async function actualizarEstado(id_documento, estado_procesamiento) {
  const [result] = await db.query(
    `UPDATE documento 
     SET estado_procesamiento = ? 
     WHERE id_documento = ?`,
    [estado_procesamiento, id_documento]
  );

  if (result.affectedRows === 0) return null;

  return await buscarPorId(id_documento);
}

module.exports = {
  crear,
  buscarPorId,
  buscarPorUsuario,
  actualizarEstado
};