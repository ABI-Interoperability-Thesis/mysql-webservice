const express = require('express');
const router = express.Router();
const apiController = require('../controllers/api-controller')

router.post('/create-request', apiController.CreateRequest)
router.put('/update-request', apiController.UpdateRequest)
router.post('/match-attribute', apiController.MatchAttribute)
module.exports = router;