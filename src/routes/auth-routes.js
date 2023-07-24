const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth-controller')
const auth = require('../Middelware/auth');
const authClient = require('../Middelware/auth-client');

router.post('/create-account', authController.CreateAccount)
router.post('/login', authController.Login)
router.get('/is-logged-in', auth, authController.IsLoggedIn)

// Client

router.post('/client-login', authController.ClientLogin)
router.post('/generate-token', authController.GenerateClientToken)
router.get('/is-logged-in-client', authClient, authController.IsLoggedIn)
router.get('/generate-token', authClient, authController.GenerateClientToken)

router.post('/create-issue', auth, authController.CreateIssue)
router.get('/issues', auth, authController.GetIssues)
router.get('/all-issues', auth, authController.GetAllIssues)
router.get('/issues/:issue_id', auth, authController.GetIssueDetails)
router.delete('/issues/:issue_id', auth, authController.DeleteIssue)
router.put('/issues/state/:issue_id', auth, authController.UpdateIssueState)

router.get('/issue-messages/:issue_id', auth, authController.GetIssueMessages)
router.post('/issue-messages/', auth, authController.CreateIssueMessage)

router.get('/requests', auth, authController.GetRequests)
router.get('/models', auth, authController.GetModels)
router.get('/models/:model_id', auth, authController.GetModelDetails)

router.get('/requests-info', auth ,authController.GetRequestsInfo)
router.get('/requests-info-by-model', auth ,authController.GetRequestsInfoByModel)

router.get('/issues-info', auth ,authController.GetIssuesInfo)

module.exports = router;