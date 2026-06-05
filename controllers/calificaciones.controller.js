const calificacionesModel = require('../models/calificaciones.model');

const emptyCalificacion = {
  id_inscripcion: '',
  nota_parcial: '',
  nota_final: '',
  observaciones: ''
};

const getMessageFromQuery = (query) => {
  const messages = {
    created: 'Calificacion registrada correctamente.',
    updated: 'Calificacion actualizada correctamente.',
    deleted: 'Calificacion eliminada correctamente.'
  };

  return messages[query.success] || null;
};

const getCalificacionData = (body) => ({
  id_inscripcion: (body.id_inscripcion || '').trim(),
  nota_parcial: (body.nota_parcial || '').trim(),
  nota_final: (body.nota_final || '').trim(),
  observaciones: (body.observaciones || '').trim()
});

const validateCalificacion = (calificacion) => {
  const errors = [];
  const notaParcial = Number(calificacion.nota_parcial);
  const notaFinal = Number(calificacion.nota_final);

  if (!calificacion.id_inscripcion) errors.push('La inscripcion es obligatoria.');
  if (calificacion.nota_parcial === '') errors.push('La nota parcial es obligatoria.');
  if (calificacion.nota_final === '') errors.push('La nota final es obligatoria.');

  if (calificacion.nota_parcial !== '' && (Number.isNaN(notaParcial) || notaParcial < 0 || notaParcial > 100)) {
    errors.push('La nota parcial debe estar entre 0 y 100.');
  }

  if (calificacion.nota_final !== '' && (Number.isNaN(notaFinal) || notaFinal < 0 || notaFinal > 100)) {
    errors.push('La nota final debe estar entre 0 y 100.');
  }

  return errors;
};

const buildCalificacionToSave = (calificacion) => {
  const notaParcial = Number(calificacion.nota_parcial);
  const notaFinal = Number(calificacion.nota_final);
  const promedio = Number(((notaParcial + notaFinal) / 2).toFixed(2));

  return {
    id_inscripcion: calificacion.id_inscripcion,
    nota_parcial: notaParcial,
    nota_final: notaFinal,
    promedio,
    resultado: promedio >= 61 ? 'Aprobado' : 'Reprobado',
    observaciones: calificacion.observaciones
  };
};

const getFormOptions = async () => {
  const inscripciones = await calificacionesModel.getActiveInscripciones();
  return { inscripciones };
};

const renderCreateForm = async (res, calificacion, errors) => {
  const { inscripciones } = await getFormOptions();

  return res.render('calificaciones/create', {
    title: 'Nueva Calificacion - EduControl G3',
    activePage: 'calificaciones',
    calificacion,
    inscripciones,
    errors
  });
};

const renderEditForm = async (res, calificacion, errors) => {
  const { inscripciones } = await getFormOptions();

  return res.render('calificaciones/edit', {
    title: 'Editar Calificacion - EduControl G3',
    activePage: 'calificaciones',
    calificacion,
    inscripciones,
    errors
  });
};

const listCalificaciones = async (req, res) => {
  try {
    const calificaciones = await calificacionesModel.getAllCalificaciones();

    res.render('calificaciones/index', {
      title: 'Calificaciones - EduControl G3',
      activePage: 'calificaciones',
      calificaciones,
      successMessage: getMessageFromQuery(req.query),
      errorMessage: req.query.error || null
    });
  } catch (error) {
    res.render('calificaciones/index', {
      title: 'Calificaciones - EduControl G3',
      activePage: 'calificaciones',
      calificaciones: [],
      successMessage: null,
      errorMessage: `No se pudieron cargar las calificaciones. Detalle: ${error.message}`
    });
  }
};

const showCreateForm = async (req, res) => {
  try {
    return renderCreateForm(res, emptyCalificacion, []);
  } catch (error) {
    return res.redirect(`/calificaciones?error=${encodeURIComponent(`No se pudo cargar el formulario. Detalle: ${error.message}`)}`);
  }
};

const createCalificacion = async (req, res) => {
  const calificacion = getCalificacionData(req.body);
  const errors = validateCalificacion(calificacion);

  try {
    if (errors.length === 0) {
      const duplicated = await calificacionesModel.existsCalificacionForInscripcion(
        calificacion.id_inscripcion
      );

      if (duplicated) {
        errors.push('Esta inscripcion ya tiene una calificacion registrada.');
      }
    }

    if (errors.length > 0) {
      return renderCreateForm(res, calificacion, errors);
    }

    await calificacionesModel.createCalificacion(buildCalificacionToSave(calificacion));
    return res.redirect('/calificaciones?success=created');
  } catch (error) {
    errors.push(`No se pudo registrar la calificacion. Detalle: ${error.message}`);
    return renderCreateForm(res, calificacion, errors);
  }
};

const showEditForm = async (req, res) => {
  try {
    const calificacion = await calificacionesModel.getCalificacionById(req.params.id);

    if (!calificacion) {
      return res.redirect('/calificaciones?error=Calificacion no encontrada.');
    }

    return renderEditForm(res, calificacion, []);
  } catch (error) {
    return res.redirect(`/calificaciones?error=${encodeURIComponent(`No se pudo cargar la calificacion. Detalle: ${error.message}`)}`);
  }
};

const updateCalificacion = async (req, res) => {
  const calificacion = getCalificacionData(req.body);
  const errors = validateCalificacion(calificacion);
  const idCalificacion = req.params.id;

  try {
    if (errors.length === 0) {
      const duplicated = await calificacionesModel.existsCalificacionForInscripcion(
        calificacion.id_inscripcion,
        idCalificacion
      );

      if (duplicated) {
        errors.push('Esta inscripcion ya tiene una calificacion registrada.');
      }
    }

    if (errors.length > 0) {
      return renderEditForm(
        res,
        {
          id_calificacion: idCalificacion,
          ...calificacion
        },
        errors
      );
    }

    await calificacionesModel.updateCalificacion(idCalificacion, buildCalificacionToSave(calificacion));
    return res.redirect('/calificaciones?success=updated');
  } catch (error) {
    errors.push(`No se pudo actualizar la calificacion. Detalle: ${error.message}`);

    return renderEditForm(
      res,
      {
        id_calificacion: idCalificacion,
        ...calificacion
      },
      errors
    );
  }
};

const deleteCalificacion = async (req, res) => {
  try {
    await calificacionesModel.deleteCalificacion(req.params.id);
    return res.redirect('/calificaciones?success=deleted');
  } catch (error) {
    return res.redirect(`/calificaciones?error=${encodeURIComponent(`No se pudo eliminar la calificacion. Detalle: ${error.message}`)}`);
  }
};

module.exports = {
  listCalificaciones,
  showCreateForm,
  createCalificacion,
  showEditForm,
  updateCalificacion,
  deleteCalificacion
};
