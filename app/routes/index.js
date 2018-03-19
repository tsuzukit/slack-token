const express = require('express');
const router = express.Router();
const controllerIndex = require('../controller/index');
const controllerAccount = require('../controller/account');

router.get('/', controllerIndex.get);
router.post('/account', controllerAccount.post);
router.get('/account', controllerAccount.get);

module.exports = router;

