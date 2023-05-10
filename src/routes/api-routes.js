const express = require('express');
const router = express.Router();
const apiController = require('../controllers/api-controller')

router.get('/requests', apiController.GetAllRequests)
router.get('/requests/:req_id', apiController.GetRequestById)
router.post('/create-request', apiController.CreateRequest)
router.put('/update-request', apiController.UpdateRequest)
router.post('/match-attribute', apiController.MatchAttribute)
router.delete('/request/:table_name/:request_id', apiController.DeleteRequest)

router.get('/models', apiController.GetModels)
router.get('/models/:model_id', apiController.GetModel)
router.get('/model-attributes/:model_id', apiController.GetModelAttributes)

router.post('/models', apiController.CreateModel)

router.post('/clients', apiController.CreateClient)
router.get('/clients', apiController.GetClients)
router.get('/clients/:client_id', apiController.GetSingleClient)
router.delete('/clients/:client_id', apiController.DeleteClient)

router.get('/attribute-mappings', apiController.GetAllAttributeMappings)
router.post('/attribute-mappings', apiController.CreateAttributeMappings)

module.exports = router;