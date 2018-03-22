const express = require('express');
const router = express.Router();
const controllerIndex = require('../controller/index');
const controllerRegister = require('../controller/register');
const controllerAction = require('../controller/action');

router.get('/', controllerIndex.get);
router.post('/api/register', controllerRegister.post);
router.post('/api/action', controllerAction.post);

module.exports = router;

