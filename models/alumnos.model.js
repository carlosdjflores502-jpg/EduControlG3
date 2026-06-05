const { getConnection } = require('../config/db');

const getAllAlumnos = async () => {
  let connection;

  try {
    connection = await getConnection();
    const [rows] = await connection.query(
      `SELECT id_alumno, carnet, nombre, apellido, correo, telefono, carrera, estado, fecha_registro
       FROM alumnos
       ORDER BY id_alumno DESC`
    );

    return rows;
  } finally {
    if (connection) {
      await connection.end();
    }
  }
};

const getAlumnoById = async (idAlumno) => {
  let connection;

  try {
    connection = await getConnection();
    const [rows] = await connection.query(
      `SELECT id_alumno, carnet, nombre, apellido, correo, telefono, carrera, estado, fecha_registro
       FROM alumnos
       WHERE id_alumno = ?`,
      [idAlumno]
    );

    return rows[0];
  } finally {
    if (connection) {
      await connection.end();
    }
  }
};

const createAlumno = async (alumno) => {
  let connection;

  try {
    connection = await getConnection();
    await connection.query(
      `INSERT INTO alumnos (carnet, nombre, apellido, correo, telefono, carrera, estado)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        alumno.carnet,
        alumno.nombre,
        alumno.apellido,
        alumno.correo,
        alumno.telefono || null,
        alumno.carrera,
        alumno.estado
      ]
    );
  } finally {
    if (connection) {
      await connection.end();
    }
  }
};

const updateAlumno = async (idAlumno, alumno) => {
  let connection;

  try {
    connection = await getConnection();
    await connection.query(
      `UPDATE alumnos
       SET carnet = ?, nombre = ?, apellido = ?, correo = ?, telefono = ?, carrera = ?, estado = ?
       WHERE id_alumno = ?`,
      [
        alumno.carnet,
        alumno.nombre,
        alumno.apellido,
        alumno.correo,
        alumno.telefono || null,
        alumno.carrera,
        alumno.estado,
        idAlumno
      ]
    );
  } finally {
    if (connection) {
      await connection.end();
    }
  }
};

const deleteAlumno = async (idAlumno) => {
  let connection;

  try {
    connection = await getConnection();
    await connection.query('DELETE FROM alumnos WHERE id_alumno = ?', [idAlumno]);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
};

module.exports = {
  getAllAlumnos,
  getAlumnoById,
  createAlumno,
  updateAlumno,
  deleteAlumno
};
