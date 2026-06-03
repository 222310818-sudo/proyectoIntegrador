const db = require('../../config/mysql');

/**
 * Crear actividad
 */
async function crear(actividad) {
  const {
    id_maestro,
    id_alumno,
    id_documento,
    titulo,
    instrucciones,
    fecha_vencimiento,
    puntos_totales
  } = actividad;

  const [result] = await db.query(
    `INSERT INTO actividad
    (
      id_maestro,
      id_alumno,
      id_documento,
      titulo,
      instrucciones,
      fecha_vencimiento,
      puntos_totales
    )
    VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      id_maestro,
      id_alumno,
      id_documento,
      titulo,
      instrucciones,
      fecha_vencimiento,
      puntos_totales
    ]
  );

  return {
    id_actividad: result.insertId,
    ...actividad
  };
}

/**
 * Listar actividades para maestros
 */
async function listar(id_maestro = null) {
  let query = `
    SELECT 
      a.*,
      d.nombre_original AS archivo_maestro,
      u.nombre AS nombre_alumno,
      u.apellido_paterno,
      u.apellido_materno
    FROM actividad a
    INNER JOIN documento d ON a.id_documento = d.id_documento
    LEFT JOIN usuario u ON a.id_alumno = u.id_usuario
  `;

  let params = [];

  if (id_maestro) {
    query += ` WHERE a.id_maestro = ?`;
    params.push(id_maestro);
  }

  query += ` ORDER BY a.fecha_vencimiento ASC`;

  const [rows] = await db.query(query, params);
  return rows;
}
/**
 * Listar actividades activas (para alumnos)
 */
async function listarActivas(id_alumno) {
  const [rows] = await db.query(
    `SELECT 
      a.*,
      d.nombre_original AS archivo_maestro,
      d.nombre_archivo
     FROM actividad a
     INNER JOIN documento d ON a.id_documento = d.id_documento
     WHERE a.estado = 'activa'
     AND (a.id_alumno IS NULL OR a.id_alumno = ?)
     ORDER BY a.fecha_vencimiento ASC`,
    [id_alumno]
  );

  return rows;
}
/**
 * Buscar actividad por ID
 */
async function buscarPorId(id_actividad) {
  const [rows] = await db.query(
    `SELECT * FROM actividad WHERE id_actividad = ? LIMIT 1`,
    [id_actividad]
  );

  return rows[0] || null;
}

/**
 * Cerrar actividad
 */
async function cerrar(id_actividad) {
  const [result] = await db.query(
    `UPDATE actividad 
     SET estado = 'cerrada' 
     WHERE id_actividad = ?`,
    [id_actividad]
  );

  if (result.affectedRows === 0) return null;

  return await buscarPorId(id_actividad);
}

module.exports = {
  crear,
  listar,
  listarActivas,
  buscarPorId,
  cerrar
};