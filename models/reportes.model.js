const { getConnection } = require('../config/db');

const getResumenAlumnosPorCurso = async () => {
  let connection;

  try {
    connection = await getConnection();
    const [rows] = await connection.query(
      `SELECT
         c.codigo,
         c.nombre,
         c.catedratico,
         COUNT(i.id_inscripcion) AS total_alumnos
       FROM cursos c
       LEFT JOIN inscripciones i ON c.id_curso = i.id_curso
       GROUP BY c.id_curso, c.codigo, c.nombre, c.catedratico
       ORDER BY c.nombre`
    );

    return rows;
  } finally {
    if (connection) {
      await connection.end();
    }
  }
};

const getCalificacionesPorCurso = async () => {
  let connection;

  try {
    connection = await getConnection();
    const [rows] = await connection.query(
      `SELECT
         CONCAT(a.nombre, ' ', a.apellido) AS alumno,
         a.carnet,
         c.nombre AS curso,
         cal.nota_parcial,
         cal.nota_final,
         cal.promedio,
         cal.resultado
       FROM calificaciones cal
       INNER JOIN inscripciones i ON cal.id_inscripcion = i.id_inscripcion
       INNER JOIN alumnos a ON i.id_alumno = a.id_alumno
       INNER JOIN cursos c ON i.id_curso = c.id_curso
       ORDER BY c.nombre, a.apellido, a.nombre`
    );

    return rows;
  } finally {
    if (connection) {
      await connection.end();
    }
  }
};

const getResumenResultados = async () => {
  let connection;

  try {
    connection = await getConnection();
    const [rows] = await connection.query(
      `SELECT
         SUM(CASE WHEN resultado = 'Aprobado' THEN 1 ELSE 0 END) AS total_aprobados,
         SUM(CASE WHEN resultado = 'Reprobado' THEN 1 ELSE 0 END) AS total_reprobados,
         AVG(promedio) AS promedio_general
       FROM calificaciones`
    );

    return {
      total_aprobados: Number(rows[0].total_aprobados || 0),
      total_reprobados: Number(rows[0].total_reprobados || 0),
      promedio_general: rows[0].promedio_general === null ? 0 : Number(rows[0].promedio_general)
    };
  } finally {
    if (connection) {
      await connection.end();
    }
  }
};

const getReportesAcademicos = async () => {
  const [
    alumnosPorCurso,
    calificacionesPorCurso,
    resumenResultados
  ] = await Promise.all([
    getResumenAlumnosPorCurso(),
    getCalificacionesPorCurso(),
    getResumenResultados()
  ]);

  return {
    alumnosPorCurso,
    calificacionesPorCurso,
    resumenResultados
  };
};

module.exports = {
  getReportesAcademicos
};
