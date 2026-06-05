const { getConnection } = require('../config/db');

const getAllInscripciones = async () => {
  let connection;

  try {
    connection = await getConnection();
    const [rows] = await connection.query(
      `SELECT
         i.id_inscripcion,
         i.id_alumno,
         i.id_curso,
         i.fecha_inscripcion,
         i.estado,
         CONCAT(a.nombre, ' ', a.apellido) AS alumno_nombre,
         a.carnet AS alumno_carnet,
         c.nombre AS curso_nombre,
         c.codigo AS curso_codigo
       FROM inscripciones i
       INNER JOIN alumnos a ON i.id_alumno = a.id_alumno
       INNER JOIN cursos c ON i.id_curso = c.id_curso
       ORDER BY i.id_inscripcion DESC`
    );

    return rows;
  } finally {
    if (connection) {
      await connection.end();
    }
  }
};

const getInscripcionById = async (idInscripcion) => {
  let connection;

  try {
    connection = await getConnection();
    const [rows] = await connection.query(
      `SELECT id_inscripcion, id_alumno, id_curso, fecha_inscripcion, estado
       FROM inscripciones
       WHERE id_inscripcion = ?`,
      [idInscripcion]
    );

    return rows[0];
  } finally {
    if (connection) {
      await connection.end();
    }
  }
};

const getActiveAlumnos = async () => {
  let connection;

  try {
    connection = await getConnection();
    const [rows] = await connection.query(
      `SELECT id_alumno, carnet, nombre, apellido
       FROM alumnos
       WHERE estado = 'Activo'
       ORDER BY nombre, apellido`
    );

    return rows;
  } finally {
    if (connection) {
      await connection.end();
    }
  }
};

const getActiveCursos = async () => {
  let connection;

  try {
    connection = await getConnection();
    const [rows] = await connection.query(
      `SELECT id_curso, codigo, nombre
       FROM cursos
       WHERE estado = 'Activo'
       ORDER BY nombre`
    );

    return rows;
  } finally {
    if (connection) {
      await connection.end();
    }
  }
};

const existsInscripcion = async (idAlumno, idCurso, ignoredIdInscripcion = null) => {
  let connection;

  try {
    connection = await getConnection();
    const params = [idAlumno, idCurso];
    let query = 'SELECT id_inscripcion FROM inscripciones WHERE id_alumno = ? AND id_curso = ?';

    if (ignoredIdInscripcion) {
      query += ' AND id_inscripcion <> ?';
      params.push(ignoredIdInscripcion);
    }

    const [rows] = await connection.query(query, params);

    return rows.length > 0;
  } finally {
    if (connection) {
      await connection.end();
    }
  }
};

const createInscripcion = async (inscripcion) => {
  let connection;

  try {
    connection = await getConnection();
    await connection.query(
      `INSERT INTO inscripciones (id_alumno, id_curso, fecha_inscripcion, estado)
       VALUES (?, ?, ?, ?)`,
      [
        inscripcion.id_alumno,
        inscripcion.id_curso,
        inscripcion.fecha_inscripcion,
        inscripcion.estado
      ]
    );
  } finally {
    if (connection) {
      await connection.end();
    }
  }
};

const updateInscripcion = async (idInscripcion, inscripcion) => {
  let connection;

  try {
    connection = await getConnection();
    await connection.query(
      `UPDATE inscripciones
       SET id_alumno = ?, id_curso = ?, fecha_inscripcion = ?, estado = ?
       WHERE id_inscripcion = ?`,
      [
        inscripcion.id_alumno,
        inscripcion.id_curso,
        inscripcion.fecha_inscripcion,
        inscripcion.estado,
        idInscripcion
      ]
    );
  } finally {
    if (connection) {
      await connection.end();
    }
  }
};

const deleteInscripcion = async (idInscripcion) => {
  let connection;

  try {
    connection = await getConnection();
    await connection.query('DELETE FROM inscripciones WHERE id_inscripcion = ?', [idInscripcion]);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
};

module.exports = {
  getAllInscripciones,
  getInscripcionById,
  getActiveAlumnos,
  getActiveCursos,
  existsInscripcion,
  createInscripcion,
  updateInscripcion,
  deleteInscripcion
};
