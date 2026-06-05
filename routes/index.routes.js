const express = require('express');
const indexController = require('../controllers/index.controller');

const router = express.Router();

router.get('/', indexController.showHome);
router.get('/test-db', indexController.testDatabaseConnection);

module.exports = router;
