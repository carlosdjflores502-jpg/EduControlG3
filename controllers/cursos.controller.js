const cursosModel = require('../models/cursos.model');

const emptyCurso = {
  codigo: '',
  nombre: '',
  descripcion: '',
  creditos: '',
  catedratico: '',
  horario: '',
  estado: 'Activo'
};

const getMessageFromQuery = (query) => {
  const messages = {
    created: 'Curso registrado correctamente.',
    updated: 'Curso actualizado correctamente.',
    deleted: 'Curso eliminado correctamente.'
  };

  return messages[query.success] || null;
};

const getCursoData = (body) => ({
  codigo: (body.codigo || '').trim(),
  nombre: (body.nombre || '').trim(),
  descripcion: (body.descripcion || '').trim(),
  creditos: (body.creditos || '').trim(),
  catedratico: (body.catedratico || '').trim(),
  horario: (body.horario || '').trim(),
  estado: body.estado === 'Inactivo' ? 'Inactivo' : 'Activo'
});

const validateCurso = (curso) => {
  const errors = [];
  const creditos = Number(curso.creditos);

  if (!curso.codigo) errors.push('El codigo es obligatorio.');
  if (!curso.nombre) errors.push('El nombre es obligatorio.');
  if (!curso.creditos) errors.push('Los creditos son obligatorios.');
  if (curso.creditos && (!Number.isInteger(creditos) || creditos <= 0)) {
    errors.push('Los creditos deben ser un numero entero mayor a cero.');
  }
  if (!curso.catedratico) errors.push('El catedratico es obligatorio.');

  return errors;
};

const normalizeCurso = (curso) => ({
  ...curso,
  creditos: Number(curso.creditos)
});

const listCursos = async (req, res) => {
  try {
    const cursos = await cursosModel.getAllCursos();

    res.render('cursos/index', {
      title: 'Cursos - EduControl G3',
      activePage: 'cursos',
      cursos,
      successMessage: getMessageFromQuery(req.query),
      errorMessage: req.query.error || null
    });
  } catch (error) {
    res.render('cursos/index', {
      title: 'Cursos - EduControl G3',
      activePage: 'cursos',
      cursos: [],
      successMessage: null,
      errorMessage: `No se pudieron cargar los cursos. Detalle: ${error.message}`
    });
  }
};

const showCreateForm = (req, res) => {
  res.render('cursos/create', {
    title: 'Nuevo Curso - EduControl G3',
    activePage: 'cursos',
    curso: emptyCurso,
    errors: []
  });
};

const createCurso = async (req, res) => {
  const curso = getCursoData(req.body);
  const errors = validateCurso(curso);

  if (errors.length > 0) {
    return res.render('cursos/create', {
      title: 'Nuevo Curso - EduControl G3',
      activePage: 'cursos',
      curso,
      errors
    });
  }

  try {
    await cursosModel.createCurso(normalizeCurso(curso));
    return res.redirect('/cursos?success=created');
  } catch (error) {
    errors.push(`No se pudo registrar el curso. Detalle: ${error.message}`);

    return res.render('cursos/create', {
      title: 'Nuevo Curso - EduControl G3',
      activePage: 'cursos',
      curso,
      errors
    });
  }
};

const showEditForm = async (req, res) => {
  try {
    const curso = await cursosModel.getCursoById(req.params.id);

    if (!curso) {
      return res.redirect('/cursos?error=Curso no encontrado.');
    }

    return res.render('cursos/edit', {
      title: 'Editar Curso - EduControl G3',
      activePage: 'cursos',
      curso,
      errors: []
    });
  } catch (error) {
    const errorMessage = `No se pudo cargar el curso. Detalle: ${error.message}`;
    return res.redirect(`/cursos?error=${encodeURIComponent(errorMessage)}`);
  }
};

const updateCurso = async (req, res) => {
  const curso = getCursoData(req.body);
  const errors = validateCurso(curso);
  const idCurso = req.params.id;

  if (errors.length > 0) {
    return res.render('cursos/edit', {
      title: 'Editar Curso - EduControl G3',
      activePage: 'cursos',
      curso: {
        id_curso: idCurso,
        ...curso
      },
      errors
    });
  }

  try {
    await cursosModel.updateCurso(idCurso, normalizeCurso(curso));
    return res.redirect('/cursos?success=updated');
  } catch (error) {
    errors.push(`No se pudo actualizar el curso. Detalle: ${error.message}`);

    return res.render('cursos/edit', {
      title: 'Editar Curso - EduControl G3',
      activePage: 'cursos',
      curso: {
        id_curso: idCurso,
        ...curso
      },
      errors
    });
  }
};

const deleteCurso = async (req, res) => {
  try {
    await cursosModel.deleteCurso(req.params.id);
    return res.redirect('/cursos?success=deleted');
  } catch (error) {
    const errorMessage = `No se pudo eliminar el curso. Detalle: ${error.message}`;
    return res.redirect(`/cursos?error=${encodeURIComponent(errorMessage)}`);
  }
};

module.exports = {
  listCursos,
  showCreateForm,
  createCurso,
  showEditForm,
  updateCurso,
  deleteCurso
};
