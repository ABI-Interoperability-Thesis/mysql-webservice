const express = require('express');
const router = express.Router();
const apiController = require('../controllers/api-controller')

router.post('/create-table', apiController.CreateTable)
module.exports = router;