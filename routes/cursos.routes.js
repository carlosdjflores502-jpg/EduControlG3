const express = require('express');
const cursosController = require('../controllers/cursos.controller');

const router = express.Router();

router.get('/', cursosController.listCursos);
router.get('/nuevo', cursosController.showCreateForm);
router.post('/nuevo', cursosController.createCurso);
router.get('/editar/:id', cursosController.showEditForm);
router.post('/editar/:id', cursosController.updateCurso);
router.post('/eliminar/:id', cursosController.deleteCurso);

module.exports = router;
