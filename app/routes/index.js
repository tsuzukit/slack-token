const express = require('express');
const router = express.Router();
const controllerIndex = require('../controller/index');
const controllerRegister = require('../controller/register');
const controllerReaction = require('../controller/reaction');

router.get('/', controllerIndex.get);
router.post('/api/register', controllerRegister.post);
router.post('/api/reaction', controllerReaction.post);

module.exports = router;

