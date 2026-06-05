const express = require('express');
const calificacionesController = require('../controllers/calificaciones.controller');

const router = express.Router();

router.get('/', calificacionesController.listCalificaciones);
router.get('/nueva', calificacionesController.showCreateForm);
router.post('/nueva', calificacionesController.createCalificacion);
router.get('/editar/:id', calificacionesController.showEditForm);
router.post('/editar/:id', calificacionesController.updateCalificacion);
router.post('/eliminar/:id', calificacionesController.deleteCalificacion);

module.exports = router;
