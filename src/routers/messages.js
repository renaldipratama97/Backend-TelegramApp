const express = require('express')
const router = express.Router()
const { insertMessages, getHistoryChat } = require('../controllers/messages')

router
.get('/', getHistoryChat)
.post('/', insertMessages)

module.exports = router