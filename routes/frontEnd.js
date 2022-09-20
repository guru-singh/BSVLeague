const express = require('express');
const path = require('path');
const router = express.Router();

const frontEndController = require('../controllers/frontEnd');

router.post('/api', frontEndController.postApi);

module.exports = router;