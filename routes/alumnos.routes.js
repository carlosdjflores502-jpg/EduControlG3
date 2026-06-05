const express = require('express');
const alumnosController = require('../controllers/alumnos.controller');

const router = express.Router();

router.get('/', alumnosController.listAlumnos);
router.get('/nuevo', alumnosController.showCreateForm);
router.post('/nuevo', alumnosController.createAlumno);
router.get('/editar/:id', alumnosController.showEditForm);
router.post('/editar/:id', alumnosController.updateAlumno);
router.post('/eliminar/:id', alumnosController.deleteAlumno);

module.exports = router;
