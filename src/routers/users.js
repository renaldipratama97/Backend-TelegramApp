const express = require('express')
const router = express.Router()

const { registerUsers, loginUsers } = require('../controllers/users')

router
.post('/register', registerUsers)
.post('/login', loginUsers)

module.exports = router