const express = require('express')
const router = express.Router()
const history = require('../controller/history')

router.get('/list', history.list);
router.post('/create', history.create);

module.exports = router
