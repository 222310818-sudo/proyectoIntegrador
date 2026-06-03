const db = require('../../config/mysql');

/**
 * Crear notificación
 */
async function crear(notificacion) {
  const {
    id_usuario,
    titulo,
    mensaje
  } = notificacion;

  const [result] = await db.query(
    `INSERT INTO notificacion 
    (id_usuario, titulo, mensaje)
    VALUES (?, ?, ?)`,
    [
      id_usuario,
      titulo,
      mensaje
    ]
  );

  return {
    id_notificacion: result.insertId,
    ...notificacion
  };
}

/**
 * Buscar por ID
 */
async function buscarPorId(id_notificacion) {
  const [rows] = await db.query(
    `SELECT * FROM notificacion WHERE id_notificacion = ? LIMIT 1`,
    [id_notificacion]
  );

  return rows[0] || null;
}

/**
 * Listar notificaciones por usuario
 */
async function listarPorUsuario(id_usuario) {
  const [rows] = await db.query(
    `SELECT * FROM notificacion 
     WHERE id_usuario = ? 
     ORDER BY fecha_creacion DESC`,
    [id_usuario]
  );

  return rows;
}

/**
 * Marcar una notificación como leída
 */
async function marcarLeida(id_notificacion) {
  const [result] = await db.query(
    `UPDATE notificacion 
     SET leida = 1 
     WHERE id_notificacion = ?`,
    [id_notificacion]
  );

  if (result.affectedRows === 0) return null;

  return await buscarPorId(id_notificacion);
}

/**
 * Marcar todas como leídas por usuario
 */
async function marcarTodasLeidas(id_usuario) {
  const [result] = await db.query(
    `UPDATE notificacion 
     SET leida = 1 
     WHERE id_usuario = ?`,
    [id_usuario]
  );

  return {
    actualizadas: result.affectedRows
  };
}

module.exports = {
  crear,
  buscarPorId,
  listarPorUsuario,
  marcarLeida,
  marcarTodasLeidas
};