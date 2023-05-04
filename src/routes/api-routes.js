const express = require('express');
const router = express.Router();
const apiController = require('../controllers/api-controller')

router.get('/requests', apiController.GetAllRequests)
router.post('/create-request', apiController.CreateRequest)
router.put('/update-request', apiController.UpdateRequest)
router.post('/match-attribute', apiController.MatchAttribute)
router.delete('/request/:table_name/:request_id', apiController.DeleteRequest)
module.exports = router;