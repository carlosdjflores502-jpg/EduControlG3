const express = require('express');
const reportesController = require('../controllers/reportes.controller');

const router = express.Router();

router.get('/', reportesController.showReportes);

module.exports = router;
