const express = require('express');
const router = express.Router();
const apiController = require('../controllers/api-controller')

router.post('/create-request', apiController.CreateRequest)
module.exports = router;