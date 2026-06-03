const db = require('../../config/mysql');

/**
 * Crear entrega
 */
async function crear(entrega) {
  const {
    id_actividad,
    id_alumno,
    id_documento
  } = entrega;

  const [result] = await db.query(
    `INSERT INTO entrega 
    (id_actividad, id_alumno, id_documento)
    VALUES (?, ?, ?)`,
    [
      id_actividad,
      id_alumno,
      id_documento
    ]
  );

  return {
    id_entrega: result.insertId,
    ...entrega
  };
}

/**
 * Buscar por ID
 */
async function buscarPorId(id_entrega) {
  const [rows] = await db.query(
    `SELECT * FROM entrega WHERE id_entrega = ? LIMIT 1`,
    [id_entrega]
  );

  return rows[0] || null;
}

/**
 * Buscar entregas por actividad
 */
async function buscarPorActividad(id_actividad) {
  const [rows] = await db.query(
    `SELECT 
      e.id_entrega,
      e.id_actividad,
      e.id_alumno,
      e.id_documento,
      e.fecha_entrega,
      e.calificacion,
      e.comentarios,
      e.estado,

      u.nombre AS nombre_alumno,
      u.apellido_paterno,
      u.apellido_materno,

      d.nombre_original AS archivo_entregado,
      d.nombre_archivo

     FROM entrega e
     INNER JOIN usuario u ON e.id_alumno = u.id_usuario
     INNER JOIN documento d ON e.id_documento = d.id_documento
     WHERE e.id_actividad = ?
     ORDER BY e.fecha_entrega DESC`,
    [id_actividad]
  );

  return rows;
}

/**
 * Buscar entregas por alumno
 */
async function buscarPorAlumno(id_alumno) {
  const [rows] = await db.query(
    `SELECT
      e.id_entrega,
      e.id_actividad,
      e.id_alumno,
      e.id_documento,
      e.fecha_entrega,
      e.calificacion,
      e.comentarios,
      e.estado,

      a.titulo AS titulo_actividad,
      a.fecha_vencimiento,
      a.instrucciones,
      a.estado AS estado_actividad,

      d_maestro.nombre_original AS archivo_maestro,
      d_maestro.nombre_archivo AS archivo_maestro_fisico,

      d_entrega.nombre_original AS archivo_entregado,
      d_entrega.nombre_archivo AS archivo_entregado_fisico

     FROM entrega e
     INNER JOIN actividad a 
      ON e.id_actividad = a.id_actividad

     INNER JOIN documento d_maestro 
      ON a.id_documento = d_maestro.id_documento

     INNER JOIN documento d_entrega 
      ON e.id_documento = d_entrega.id_documento

     WHERE e.id_alumno = ?
     ORDER BY e.fecha_entrega DESC`,
    [id_alumno]
  );

  return rows;
}

/**
 * Buscar entrega por actividad y alumno
 */
async function buscarPorActividadYAlumno(id_actividad, id_alumno) {
  const [rows] = await db.query(
    `SELECT * FROM entrega 
     WHERE id_actividad = ? AND id_alumno = ? 
     LIMIT 1`,
    [id_actividad, id_alumno]
  );

  return rows[0] || null;
}

/**
 * Calificar entrega
 */
async function calificar(id_entrega, calificacion, comentarios = null) {
  const [result] = await db.query(
    `UPDATE entrega 
     SET calificacion = ?, comentarios = ?, estado = 'calificada'
     WHERE id_entrega = ?`,
    [calificacion, comentarios, id_entrega]
  );

  if (result.affectedRows === 0) return null;

  return await buscarPorId(id_entrega);
}

module.exports = {
  crear,
  buscarPorId,
  buscarPorActividad,
  buscarPorAlumno,
  buscarPorActividadYAlumno,
  calificar
};