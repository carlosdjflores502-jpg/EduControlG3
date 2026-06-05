const alumnosModel = require('../models/alumnos.model');

const emptyAlumno = {
  carnet: '',
  nombre: '',
  apellido: '',
  correo: '',
  telefono: '',
  carrera: '',
  estado: 'Activo'
};

const getMessageFromQuery = (query) => {
  const messages = {
    created: 'Alumno registrado correctamente.',
    updated: 'Alumno actualizado correctamente.',
    deleted: 'Alumno eliminado correctamente.'
  };

  return messages[query.success] || null;
};

const getAlumnoData = (body) => ({
  carnet: (body.carnet || '').trim(),
  nombre: (body.nombre || '').trim(),
  apellido: (body.apellido || '').trim(),
  correo: (body.correo || '').trim(),
  telefono: (body.telefono || '').trim(),
  carrera: (body.carrera || '').trim(),
  estado: body.estado === 'Inactivo' ? 'Inactivo' : 'Activo'
});

const validateAlumno = (alumno) => {
  const errors = [];

  if (!alumno.carnet) errors.push('El carnet es obligatorio.');
  if (!alumno.nombre) errors.push('El nombre es obligatorio.');
  if (!alumno.apellido) errors.push('El apellido es obligatorio.');
  if (!alumno.correo) errors.push('El correo es obligatorio.');
  if (!alumno.carrera) errors.push('La carrera es obligatoria.');

  return errors;
};

const listAlumnos = async (req, res) => {
  try {
    const alumnos = await alumnosModel.getAllAlumnos();

    res.render('alumnos/index', {
      title: 'Alumnos - EduControl G3',
      activePage: 'alumnos',
      alumnos,
      successMessage: getMessageFromQuery(req.query),
      errorMessage: req.query.error || null
    });
  } catch (error) {
    res.render('alumnos/index', {
      title: 'Alumnos - EduControl G3',
      activePage: 'alumnos',
      alumnos: [],
      successMessage: null,
      errorMessage: `No se pudieron cargar los alumnos. Detalle: ${error.message}`
    });
  }
};

const showCreateForm = (req, res) => {
  res.render('alumnos/create', {
    title: 'Nuevo Alumno - EduControl G3',
    activePage: 'alumnos',
    alumno: emptyAlumno,
    errors: []
  });
};

const createAlumno = async (req, res) => {
  const alumno = getAlumnoData(req.body);
  const errors = validateAlumno(alumno);

  if (errors.length > 0) {
    return res.render('alumnos/create', {
      title: 'Nuevo Alumno - EduControl G3',
      activePage: 'alumnos',
      alumno,
      errors
    });
  }

  try {
    await alumnosModel.createAlumno(alumno);
    return res.redirect('/alumnos?success=created');
  } catch (error) {
    errors.push(`No se pudo registrar el alumno. Detalle: ${error.message}`);

    return res.render('alumnos/create', {
      title: 'Nuevo Alumno - EduControl G3',
      activePage: 'alumnos',
      alumno,
      errors
    });
  }
};

const showEditForm = async (req, res) => {
  try {
    const alumno = await alumnosModel.getAlumnoById(req.params.id);

    if (!alumno) {
      return res.redirect('/alumnos?error=Alumno no encontrado.');
    }

    return res.render('alumnos/edit', {
      title: 'Editar Alumno - EduControl G3',
      activePage: 'alumnos',
      alumno,
      errors: []
    });
  } catch (error) {
    return res.redirect(`/alumnos?error=${encodeURIComponent(`No se pudo cargar el alumno. Detalle: ${error.message}`)}`);
  }
};

const updateAlumno = async (req, res) => {
  const alumno = getAlumnoData(req.body);
  const errors = validateAlumno(alumno);
  const idAlumno = req.params.id;

  if (errors.length > 0) {
    return res.render('alumnos/edit', {
      title: 'Editar Alumno - EduControl G3',
      activePage: 'alumnos',
      alumno: {
        id_alumno: idAlumno,
        ...alumno
      },
      errors
    });
  }

  try {
    await alumnosModel.updateAlumno(idAlumno, alumno);
    return res.redirect('/alumnos?success=updated');
  } catch (error) {
    errors.push(`No se pudo actualizar el alumno. Detalle: ${error.message}`);

    return res.render('alumnos/edit', {
      title: 'Editar Alumno - EduControl G3',
      activePage: 'alumnos',
      alumno: {
        id_alumno: idAlumno,
        ...alumno
      },
      errors
    });
  }
};

const deleteAlumno = async (req, res) => {
  try {
    await alumnosModel.deleteAlumno(req.params.id);
    return res.redirect('/alumnos?success=deleted');
  } catch (error) {
    return res.redirect(`/alumnos?error=${encodeURIComponent(`No se pudo eliminar el alumno. Detalle: ${error.message}`)}`);
  }
};

module.exports = {
  listAlumnos,
  showCreateForm,
  createAlumno,
  showEditForm,
  updateAlumno,
  deleteAlumno
};
