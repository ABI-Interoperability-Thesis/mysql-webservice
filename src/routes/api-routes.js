const express = require('express');
const router = express.Router();
const apiController = require('../controllers/api-controller')
const fhirController = require('../controllers/fhir-controller')
const auth = require('../Middelware/auth');
const authClient = require('../Middelware/auth-client');

router.get('/requests', auth, apiController.GetAllRequests)
router.get('/requests/:req_id', apiController.GetRequestById)
router.post('/create-request', apiController.CreateRequest)
router.post('/create-request-2/:model', auth, apiController.CreateRequest2)
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

router.get('/client-mappings/:model', authClient, apiController.GetClientMappings)
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

router.post('/test-preprocessor/', apiController.TestSinglePreprocessor)

router.get('/model-preprocessors/:model_id/:field', apiController.GetModelPreprocessors)
router.post('/model-preprocessors', apiController.CreateModelPreprocessors)
router.delete('/model-preprocessors/:preprocessor_id', apiController.DeleteModelPreprocessors)

router.post('/preprocessing/:model', apiController.RunPreprocessors)

router.post('/run-validation/:model_id', apiController.RunValidations)
router.post('/test-validation', apiController.TestValidation)

router.get('/check-client-mappings/:model_id/:client_id/:field', apiController.CheckClientMappings)

router.get('/dash-requests', apiController.GetRequestsDashboardInfo)
router.get('/dash-requests-by-model', apiController.GetRequestsDashboardInfoByModel)

router.get('/dash-model-config', apiController.GetModelsConfiguration)
router.get('/model-config/:model_id', apiController.GetModelsConfigurationByModel)

router.put('/deploy-model/:model_id', apiController.DeployModel)
router.put('/undeploy-model/:model_id', apiController.UndeployModel)

router.get('/issues-info', apiController.GetIssuesInfo)

router.post('/hl7-example', apiController.GenerateHL7Example)

router.post('/mirth-channels', apiController.StoreMirthIds)
router.get('/mirth-channels', apiController.GetMirthIds)

router.post('/proxy-request', apiController.ProxyRequest)

router.post('/run-model-interoperability', auth, apiController.RunModelInteroperability)
router.post('/hl7/resource/test', apiController.TestHL7Resource)




// Fhir routes
router.get('/fhir/versions', fhirController.GetFhirVersions)
router.get('/fhir/schema/:version', fhirController.GetFhirSchema)
router.get('/fhir/schema/resource-types/:version', fhirController.GetFhirResourceTypes)
router.get('/fhir/schema/resource-types/definitions/:definition/:version', fhirController.GetFhirResourceTypesDefinitions)
router.post('/fhir/resource/test', fhirController.TestResourceMapping)
router.post('/fhir/mappings/', fhirController.CreateFhirMappings)
router.get('/fhir/mappings/defaults/:model_id/:field', fhirController.GetDefaultFhirMappings)
router.delete('/fhir/mappings/defaults/:mapping_id', fhirController.DeleteFhirMapping)

module.exports = router;