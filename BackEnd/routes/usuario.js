const express = require('express');
const router = express.Router();
const controller = require('../controllers/usuario')

router.post('/', controller.novo)
router.post('/login', controller.login)
router.get('/', controller.listar)

module.exports = router;