const { getConnection } = require('../config/db');

const getDashboardCounts = async () => {
  let connection;

  try {
    connection = await getConnection();

    const queries = [
      connection.query('SELECT COUNT(*) AS total FROM alumnos'),
      connection.query('SELECT COUNT(*) AS total FROM cursos'),
      connection.query('SELECT COUNT(*) AS total FROM inscripciones'),
      connection.query('SELECT COUNT(*) AS total FROM calificaciones')
    ];

    const [
      [alumnosRows],
      [cursosRows],
      [inscripcionesRows],
      [calificacionesRows]
    ] = await Promise.all(queries);

    return {
      alumnos: alumnosRows[0].total,
      cursos: cursosRows[0].total,
      inscripciones: inscripcionesRows[0].total,
      calificaciones: calificacionesRows[0].total
    };
  } finally {
    if (connection) {
      await connection.end();
    }
  }
};

module.exports = {
  getDashboardCounts
};
