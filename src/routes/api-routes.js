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
router.delete('/models/:model_id', apiController.DeleteModel)

router.post('/clients', apiController.CreateClient)
router.get('/clients', apiController.GetClients)
router.get('/clients/:client_id', apiController.GetSingleClient)
router.delete('/clients/:client_id', apiController.DeleteClient)

router.get('/attribute-mappings', apiController.GetAllAttributeMappings)
router.get('/attribute-mappings/:model_name', apiController.GetAllAttributeMappingsByModel)
router.get('/attribute-mappings/:model_name/:model_attribute', apiController.GetAllAttributeMappingsByModelAndAttribute)
router.post('/attribute-mappings', apiController.CreateAttributeMappings)
router.delete('/attribute-mappings/:attribute_mapping_id', apiController.DeleteAttributeMapping)

router.get('/hl7-types', apiController.GetHl7Types)

router.get('/hl7-triggers', apiController.GetHl7Triggers)

router.get('/hl7-segments', apiController.GetHl7Segments)

router.get('/hl7-fields/:msg_segment', apiController.GetHl7Fields)
router.get('/hl7-sub-fields/:hl7_field', apiController.GetHl7SubFields)

router.get('/client-mappings/:client_id/:model', apiController.GetClientMappings)
router.post('/client-mappings', apiController.CreateClientMapping)
router.delete('/client-mappings/:mapping_id', apiController.DeleteClientMapping)
router.put('/client-mappings/', apiController.UpdateClientMapping)

router.get('/client-models/:client_id', apiController.GetClientModels)
router.delete('/client-models/:rel_id', apiController.DeleteClientModels)
router.post('/client-models', apiController.CreateClientModels)

router.get('/default-check/:model_id/:field', apiController.DefaultCheck)

router.get('/preprocessing-options', apiController.GetPreprocessingOptions)

router.get('/validations', apiController.GetValidations)
router.post('/validations', apiController.CreateValidation)
router.delete('/validations/:validation_id', apiController.DeleteValidations)

router.get('/model-validations/:model_id/:field', apiController.GetModelValidations)
router.post('/model-validations', apiController.CreateModelValidation)
router.delete('/model-validations/:validation_id', apiController.DeleteModelValidations)

router.get('/preprocessors', apiController.GetPreprocessors)
router.post('/preprocessors', apiController.CreatePreprocessors)
router.delete('/preprocessors/:preprocessor_id', apiController.DeletePreprocessors)

router.get('/model-preprocessors/:model_id/:field', apiController.GetModelPreprocessors)
router.post('/model-preprocessors', apiController.CreateModelPreprocessors)
router.delete('/model-preprocessors/:preprocessor_id', apiController.DeleteModelPreprocessors)

router.post('/preprocessing/:model', apiController.RunPreprocessors)

router.post('/run-validation/:model_id', apiController.RunValidations)

router.get('/check-client-mappings/:model_id/:client_id/:field', apiController.CheckClientMappings)


module.exports = router;