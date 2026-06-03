const db = require('../../config/mysql');

/**
 * Crear trabajo personal
 */
async function crear(trabajo) {
  const {
    id_usuario,
    id_documento,
    titulo,
    descripcion
  } = trabajo;

  const [result] = await db.query(
    `INSERT INTO trabajo_personal 
    (id_usuario, id_documento, titulo, descripcion)
    VALUES (?, ?, ?, ?)`,
    [
      id_usuario,
      id_documento,
      titulo,
      descripcion
    ]
  );

  return {
    id_trabajo: result.insertId,
    ...trabajo
  };
}

/**
 * Buscar por ID
 */
async function buscarPorId(id_trabajo) {
  const [rows] = await db.query(
    `SELECT * FROM trabajo_personal WHERE id_trabajo = ? LIMIT 1`,
    [id_trabajo]
  );

  return rows[0] || null;
}

/**
 * Listar trabajos (por usuario opcional)
 */
async function listar(id_usuario = null) {
  let query = `SELECT * FROM trabajo_personal`;
  let params = [];

  if (id_usuario) {
    query += ` WHERE id_usuario = ?`;
    params.push(id_usuario);
  }

  query += ` ORDER BY fecha_creacion DESC`;

  const [rows] = await db.query(query, params);
  return rows;
}

/**
 * Alternar favorito (0 ↔ 1)
 */
async function toggleFavorito(id_trabajo) {
  const trabajo = await buscarPorId(id_trabajo);
  if (!trabajo) return null;

  const nuevoValor = trabajo.favorito ? 0 : 1;

  await db.query(
    `UPDATE trabajo_personal 
     SET favorito = ? 
     WHERE id_trabajo = ?`,
    [nuevoValor, id_trabajo]
  );

  return await buscarPorId(id_trabajo);
}

/**
 * Eliminar trabajo
 */
async function eliminar(id_trabajo) {
  const [result] = await db.query(
    `DELETE FROM trabajo_personal WHERE id_trabajo = ?`,
    [id_trabajo]
  );

  return result.affectedRows > 0;
}

module.exports = {
  crear,
  buscarPorId,
  listar,
  toggleFavorito,
  eliminar
};