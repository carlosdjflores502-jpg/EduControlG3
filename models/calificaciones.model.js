const { getConnection } = require('../config/db');

const getAllCalificaciones = async () => {
  let connection;

  try {
    connection = await getConnection();
    const [rows] = await connection.query(
      `SELECT
         cal.id_calificacion,
         cal.id_inscripcion,
         cal.nota_parcial,
         cal.nota_final,
         cal.promedio,
         cal.resultado,
         cal.observaciones,
         cal.fecha_registro,
         CONCAT(a.nombre, ' ', a.apellido) AS alumno_nombre,
         a.carnet AS alumno_carnet,
         c.nombre AS curso_nombre,
         c.codigo AS curso_codigo
       FROM calificaciones cal
       INNER JOIN inscripciones i ON cal.id_inscripcion = i.id_inscripcion
       INNER JOIN alumnos a ON i.id_alumno = a.id_alumno
       INNER JOIN cursos c ON i.id_curso = c.id_curso
       ORDER BY cal.id_calificacion DESC`
    );

    return rows;
  } finally {
    if (connection) {
      await connection.end();
    }
  }
};

const getCalificacionById = async (idCalificacion) => {
  let connection;

  try {
    connection = await getConnection();
    const [rows] = await connection.query(
      `SELECT id_calificacion, id_inscripcion, nota_parcial, nota_final, promedio, resultado, observaciones, fecha_registro
       FROM calificaciones
       WHERE id_calificacion = ?`,
      [idCalificacion]
    );

    return rows[0];
  } finally {
    if (connection) {
      await connection.end();
    }
  }
};

const getActiveInscripciones = async () => {
  let connection;

  try {
    connection = await getConnection();
    const [rows] = await connection.query(
      `SELECT
         i.id_inscripcion,
         CONCAT(a.nombre, ' ', a.apellido) AS alumno_nombre,
         a.carnet AS alumno_carnet,
         c.nombre AS curso_nombre,
         c.codigo AS curso_codigo
       FROM inscripciones i
       INNER JOIN alumnos a ON i.id_alumno = a.id_alumno
       INNER JOIN cursos c ON i.id_curso = c.id_curso
       WHERE i.estado = 'Activa'
       ORDER BY a.nombre, a.apellido, c.nombre`
    );

    return rows;
  } finally {
    if (connection) {
      await connection.end();
    }
  }
};

const existsCalificacionForInscripcion = async (idInscripcion, ignoredIdCalificacion = null) => {
  let connection;

  try {
    connection = await getConnection();
    const params = [idInscripcion];
    let query = 'SELECT id_calificacion FROM calificaciones WHERE id_inscripcion = ?';

    if (ignoredIdCalificacion) {
      query += ' AND id_calificacion <> ?';
      params.push(ignoredIdCalificacion);
    }

    const [rows] = await connection.query(query, params);

    return rows.length > 0;
  } finally {
    if (connection) {
      await connection.end();
    }
  }
};

const createCalificacion = async (calificacion) => {
  let connection;

  try {
    connection = await getConnection();
    await connection.query(
      `INSERT INTO calificaciones (id_inscripcion, nota_parcial, nota_final, promedio, resultado, observaciones)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        calificacion.id_inscripcion,
        calificacion.nota_parcial,
        calificacion.nota_final,
        calificacion.promedio,
        calificacion.resultado,
        calificacion.observaciones || null
      ]
    );
  } finally {
    if (connection) {
      await connection.end();
    }
  }
};

const updateCalificacion = async (idCalificacion, calificacion) => {
  let connection;

  try {
    connection = await getConnection();
    await connection.query(
      `UPDATE calificaciones
       SET id_inscripcion = ?, nota_parcial = ?, nota_final = ?, promedio = ?, resultado = ?, observaciones = ?
       WHERE id_calificacion = ?`,
      [
        calificacion.id_inscripcion,
        calificacion.nota_parcial,
        calificacion.nota_final,
        calificacion.promedio,
        calificacion.resultado,
        calificacion.observaciones || null,
        idCalificacion
      ]
    );
  } finally {
    if (connection) {
      await connection.end();
    }
  }
};

const deleteCalificacion = async (idCalificacion) => {
  let connection;

  try {
    connection = await getConnection();
    await connection.query('DELETE FROM calificaciones WHERE id_calificacion = ?', [idCalificacion]);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
};

module.exports = {
  getAllCalificaciones,
  getCalificacionById,
  getActiveInscripciones,
  existsCalificacionForInscripcion,
  createCalificacion,
  updateCalificacion,
  deleteCalificacion
};
