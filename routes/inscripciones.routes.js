const express = require('express');
const inscripcionesController = require('../controllers/inscripciones.controller');

const router = express.Router();

router.get('/', inscripcionesController.listInscripciones);
router.get('/nueva', inscripcionesController.showCreateForm);
router.post('/nueva', inscripcionesController.createInscripcion);
router.get('/editar/:id', inscripcionesController.showEditForm);
router.post('/editar/:id', inscripcionesController.updateInscripcion);
router.post('/eliminar/:id', inscripcionesController.deleteInscripcion);

module.exports = router;
