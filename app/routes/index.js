const express = require('express');
const router = express.Router();
const controllerIndex = require('../controller/index');
const controllerRegister = require('../controller/register');
const controllerReaction = require('../controller/reaction');
const verifier = require('../middleware/verifier');

router.get('/', controllerIndex.get);
router.post('/api/register', verifier.verifyToken, verifier.verifyChannel, controllerRegister.post);
router.post('/api/reaction', verifier.verifyToken, verifier.verifyChallenge, verifier.verifyChannel, controllerReaction.post);

module.exports = router;

