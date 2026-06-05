const inscripcionesModel = require('../models/inscripciones.model');

const estadosValidos = ['Activa', 'Cancelada', 'Finalizada'];

const emptyInscripcion = {
  id_alumno: '',
  id_curso: '',
  fecha_inscripcion: '',
  estado: 'Activa'
};

const getMessageFromQuery = (query) => {
  const messages = {
    created: 'Inscripcion registrada correctamente.',
    updated: 'Inscripcion actualizada correctamente.',
    deleted: 'Inscripcion eliminada correctamente.'
  };

  return messages[query.success] || null;
};

const formatDateForInput = (dateValue) => {
  if (!dateValue) return '';

  if (dateValue instanceof Date) {
    return dateValue.toISOString().slice(0, 10);
  }

  return String(dateValue).slice(0, 10);
};

const getInscripcionData = (body) => ({
  id_alumno: (body.id_alumno || '').trim(),
  id_curso: (body.id_curso || '').trim(),
  fecha_inscripcion: (body.fecha_inscripcion || '').trim(),
  estado: estadosValidos.includes(body.estado) ? body.estado : ''
});

const validateInscripcion = (inscripcion) => {
  const errors = [];

  if (!inscripcion.id_alumno) errors.push('El alumno es obligatorio.');
  if (!inscripcion.id_curso) errors.push('El curso es obligatorio.');
  if (!inscripcion.fecha_inscripcion) errors.push('La fecha de inscripcion es obligatoria.');
  if (!inscripcion.estado) errors.push('El estado es obligatorio.');

  return errors;
};

const getFormOptions = async () => {
  const [alumnos, cursos] = await Promise.all([
    inscripcionesModel.getActiveAlumnos(),
    inscripcionesModel.getActiveCursos()
  ]);

  return { alumnos, cursos };
};

const renderCreateForm = async (res, inscripcion, errors) => {
  const { alumnos, cursos } = await getFormOptions();

  return res.render('inscripciones/create', {
    title: 'Nueva Inscripcion - EduControl G3',
    activePage: 'inscripciones',
    inscripcion,
    alumnos,
    cursos,
    estados: estadosValidos,
    errors
  });
};

const renderEditForm = async (res, inscripcion, errors) => {
  const { alumnos, cursos } = await getFormOptions();

  return res.render('inscripciones/edit', {
    title: 'Editar Inscripcion - EduControl G3',
    activePage: 'inscripciones',
    inscripcion: {
      ...inscripcion,
      fecha_inscripcion: formatDateForInput(inscripcion.fecha_inscripcion)
    },
    alumnos,
    cursos,
    estados: estadosValidos,
    errors
  });
};

const listInscripciones = async (req, res) => {
  try {
    const inscripciones = await inscripcionesModel.getAllInscripciones();

    res.render('inscripciones/index', {
      title: 'Inscripciones - EduControl G3',
      activePage: 'inscripciones',
      inscripciones,
      successMessage: getMessageFromQuery(req.query),
      errorMessage: req.query.error || null
    });
  } catch (error) {
    res.render('inscripciones/index', {
      title: 'Inscripciones - EduControl G3',
      activePage: 'inscripciones',
      inscripciones: [],
      successMessage: null,
      errorMessage: `No se pudieron cargar las inscripciones. Detalle: ${error.message}`
    });
  }
};

const showCreateForm = async (req, res) => {
  try {
    return renderCreateForm(res, emptyInscripcion, []);
  } catch (error) {
    return res.redirect(`/inscripciones?error=${encodeURIComponent(`No se pudo cargar el formulario. Detalle: ${error.message}`)}`);
  }
};

const createInscripcion = async (req, res) => {
  const inscripcion = getInscripcionData(req.body);
  const errors = validateInscripcion(inscripcion);

  try {
    if (errors.length === 0) {
      const duplicated = await inscripcionesModel.existsInscripcion(
        inscripcion.id_alumno,
        inscripcion.id_curso
      );

      if (duplicated) {
        errors.push('El alumno ya esta inscrito en este curso.');
      }
    }

    if (errors.length > 0) {
      return renderCreateForm(res, inscripcion, errors);
    }

    await inscripcionesModel.createInscripcion(inscripcion);
    return res.redirect('/inscripciones?success=created');
  } catch (error) {
    errors.push(`No se pudo registrar la inscripcion. Detalle: ${error.message}`);
    return renderCreateForm(res, inscripcion, errors);
  }
};

const showEditForm = async (req, res) => {
  try {
    const inscripcion = await inscripcionesModel.getInscripcionById(req.params.id);

    if (!inscripcion) {
      return res.redirect('/inscripciones?error=Inscripcion no encontrada.');
    }

    return renderEditForm(res, inscripcion, []);
  } catch (error) {
    return res.redirect(`/inscripciones?error=${encodeURIComponent(`No se pudo cargar la inscripcion. Detalle: ${error.message}`)}`);
  }
};

const updateInscripcion = async (req, res) => {
  const inscripcion = getInscripcionData(req.body);
  const errors = validateInscripcion(inscripcion);
  const idInscripcion = req.params.id;

  try {
    if (errors.length === 0) {
      const duplicated = await inscripcionesModel.existsInscripcion(
        inscripcion.id_alumno,
        inscripcion.id_curso,
        idInscripcion
      );

      if (duplicated) {
        errors.push('El alumno ya esta inscrito en este curso.');
      }
    }

    if (errors.length > 0) {
      return renderEditForm(
        res,
        {
          id_inscripcion: idInscripcion,
          ...inscripcion
        },
        errors
      );
    }

    await inscripcionesModel.updateInscripcion(idInscripcion, inscripcion);
    return res.redirect('/inscripciones?success=updated');
  } catch (error) {
    errors.push(`No se pudo actualizar la inscripcion. Detalle: ${error.message}`);

    return renderEditForm(
      res,
      {
        id_inscripcion: idInscripcion,
        ...inscripcion
      },
      errors
    );
  }
};

const deleteInscripcion = async (req, res) => {
  try {
    await inscripcionesModel.deleteInscripcion(req.params.id);
    return res.redirect('/inscripciones?success=deleted');
  } catch (error) {
    return res.redirect(`/inscripciones?error=${encodeURIComponent(`No se pudo eliminar la inscripcion. Detalle: ${error.message}`)}`);
  }
};

module.exports = {
  listInscripciones,
  showCreateForm,
  createInscripcion,
  showEditForm,
  updateInscripcion,
  deleteInscripcion
};
