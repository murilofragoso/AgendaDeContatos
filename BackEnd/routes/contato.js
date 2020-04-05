const express = require('express');
const router = express.Router();
const controller = require('../controllers/contato')

router.post('/', controller.novo)
router.get('/', controller.listar)

module.exports = router;