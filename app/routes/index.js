const express = require('express');
const router = express.Router();
const controllerIndex = require('../controller/index');
const controllerRegister = require('../controller/register');

router.get('/', controllerIndex.get);
router.post('/api/register', controllerRegister.post);

module.exports = router;

