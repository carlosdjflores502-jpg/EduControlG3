const reportesModel = require('../models/reportes.model');

const showReportes = async (req, res) => {
  const emptyReportes = {
    alumnosPorCurso: [],
    calificacionesPorCurso: [],
    resumenResultados: {
      total_aprobados: 0,
      total_reprobados: 0,
      promedio_general: 0
    }
  };

  try {
    const reportes = await reportesModel.getReportesAcademicos();

    res.render('reportes/index', {
      title: 'Reportes - EduControl G3',
      activePage: 'reportes',
      reportes,
      errorMessage: null
    });
  } catch (error) {
    res.render('reportes/index', {
      title: 'Reportes - EduControl G3',
      activePage: 'reportes',
      reportes: emptyReportes,
      errorMessage: `No se pudieron cargar los reportes. Detalle: ${error.message}`
    });
  }
};

module.exports = {
  showReportes
};
