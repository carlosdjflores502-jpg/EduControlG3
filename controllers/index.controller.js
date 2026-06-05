const { getConnection } = require('../config/db');
const dashboardModel = require('../models/dashboard.model');

const showHome = async (req, res) => {
  const defaultCounts = {
    alumnos: 0,
    cursos: 0,
    inscripciones: 0,
    calificaciones: 0
  };

  try {
    const counts = await dashboardModel.getDashboardCounts();

    res.render('index', {
      title: 'EduControl G3',
      activePage: 'dashboard',
      counts,
      errorMessage: null
    });
  } catch (error) {
    res.render('index', {
      title: 'EduControl G3',
      activePage: 'dashboard',
      counts: defaultCounts,
      errorMessage: `No se pudieron cargar los datos del dashboard. Detalle: ${error.message}`
    });
  }
};

const testDatabaseConnection = async (req, res) => {
  let connection;

  try {
    connection = await getConnection();
    await connection.ping();
    res.send('Conexion exitosa a la base de datos EduControl G3');
  } catch (error) {
    res.status(500).send(`Error al conectar con la base de datos: ${error.message}`);
  } finally {
    if (connection) {
      await connection.end();
    }
  }
};

module.exports = {
  showHome,
  testDatabaseConnection
};
