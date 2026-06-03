const db = require('../../config/mysql');

/**
 * Crear usuario
 */
async function crear(usuario) {
  const {
    nombre,
    apellido_paterno,
    apellido_materno,
    email,
    password_hash,
    tipo_usuario,
    discapacidad_visual = 1
  } = usuario;

  const [result] = await db.query(
    `INSERT INTO usuario 
    (nombre, apellido_paterno, apellido_materno, email, password_hash, tipo_usuario, discapacidad_visual)
    VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      nombre,
      apellido_paterno,
      apellido_materno,
      email,
      password_hash,
      tipo_usuario,
      discapacidad_visual
    ]
  );

  return {
    id_usuario: result.insertId,
    ...usuario
  };
}

/**
 * Buscar por email
 */
async function buscarPorEmail(email) {
  const [rows] = await db.query(
    `SELECT * FROM usuario WHERE email = ? LIMIT 1`,
    [email]
  );

  return rows[0] || null;
}

/**
 * Buscar por ID
 */
async function buscarPorId(id_usuario) {
  const [rows] = await db.query(
    `SELECT * FROM usuario WHERE id_usuario = ? LIMIT 1`,
    [id_usuario]
  );

  return rows[0] || null;
}

/**
 * Actualizar usuario
 */
async function actualizar(id_usuario, datos) {
  const campos = [];
  const valores = [];

  for (let key in datos) {
    campos.push(`${key} = ?`);
    valores.push(datos[key]);
  }

  if (campos.length === 0) return null;

  valores.push(id_usuario);

  const [result] = await db.query(
    `UPDATE usuario SET ${campos.join(', ')} WHERE id_usuario = ?`,
    valores
  );

  if (result.affectedRows === 0) return null;

  return await buscarPorId(id_usuario);
}
async function buscarAlumnos() {
  const [rows] = await db.query(
    `SELECT id_usuario, nombre, apellido_paterno, apellido_materno, email
     FROM usuario
     WHERE tipo_usuario = 'alumno'
     ORDER BY nombre ASC`
  );

  return rows;
}

module.exports = {
  crear,
  buscarPorEmail,
  buscarPorId,
  actualizar,
  buscarAlumnos
};