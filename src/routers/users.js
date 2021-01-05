const express = require('express')
const router = express.Router()
const { uploadMulter } = require('../middleware/upload')
const { getAllUsers, getUserById, registerUsers, deleteUser, loginUsers, updateBio, getFriendList, updatePhotoProfile, updatePhones, onlineUser, offlineUser } = require('../controllers/users')

router
.get('/', getAllUsers)
.get('/getFriend/:idUser', getFriendList)
.get('/:idUser', getUserById)
.post('/register', registerUsers)
.post('/login', loginUsers)
.patch('/onlineuser/:idUser', onlineUser)
.patch('/offlineuser/:idUser', offlineUser)
.patch('/photoProfile/:idUser', uploadMulter.single('picture'), updatePhotoProfile)
.patch('/phonenumber/:idUser', updatePhones)
.patch('/bio/:idUser', updateBio)
.delete('/:idUser', deleteUser)

module.exports = router