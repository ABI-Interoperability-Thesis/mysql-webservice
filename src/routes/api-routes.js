const express = require('express');
const router = express.Router();
const apiController = require('../controllers/api-controller')

router.get('/sample-route', apiController.SampleController)
module.exports = router;