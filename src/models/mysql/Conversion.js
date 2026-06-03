const db = require('../../config/mysql');

/**
 * Crear conversión
 */
async function crear(conversion) {
  const {
    id_documento,
    tipo_salida,
    estado = 'procesando',
    mensaje_error = null
  } = conversion;

  const [result] = await db.query(
    `INSERT INTO conversion 
    (id_documento, tipo_salida, estado, mensaje_error)
    VALUES (?, ?, ?, ?)`,
    [
      id_documento,
      tipo_salida,
      estado,
      mensaje_error
    ]
  );

  return {
    id_conversion: result.insertId,
    ...conversion
  };
}

/**
 * Buscar por ID
 */
async function buscarPorId(id_conversion) {
  const [rows] = await db.query(
    `SELECT * FROM conversion WHERE id_conversion = ? LIMIT 1`,
    [id_conversion]
  );

  return rows[0] || null;
}

/**
 * Buscar conversiones por documento
 */
async function buscarPorDocumento(id_documento) {
  const [rows] = await db.query(
    `SELECT * FROM conversion 
     WHERE id_documento = ? 
     ORDER BY fecha_conversion DESC`,
    [id_documento]
  );

  return rows;
}

/**
 * Actualizar estado de la conversión
 */
async function actualizarEstado(id_conversion, estado, mensaje_error = null) {
  const [result] = await db.query(
    `UPDATE conversion 
     SET estado = ?, mensaje_error = ?
     WHERE id_conversion = ?`,
    [estado, mensaje_error, id_conversion]
  );

  if (result.affectedRows === 0) return null;

  return await buscarPorId(id_conversion);
}

module.exports = {
  crear,
  buscarPorId,
  buscarPorDocumento,
  actualizarEstado
};