const createError = require('http-errors')
const bcrypt = require('bcrypt')
const { v4: uuidv4 } = require('uuid')
const jwt = require('jsonwebtoken')
const { response } = require('../helpers/response')

const usersModels = require('../models/users')

const usersController =  {
    getAllUsers: (req, res, next) => {
        usersModels.getAllUsers()
        .then(result => {
            response(res, result,{ status: 'succeed', statusCode: '200' }, null)
        })
        .catch(() => {
            const error = new createError(500, 'Looks like server having trouble')
            return next(error)
        })
    },
    getFriendList: (req, res, next) => {
        const idUser = req.params.idUser
        usersModels.getFriendList(idUser)
        .then(result => {
            response(res, result,{ status: 'succeed', statusCode: '200' }, null)
        })
        .catch(() => {
            const error = new createError(500, 'Looks like server having trouble')
            return next(error)
        })
    },
    getUserById: (req, res, next) => {
        const idUser = req.params.idUser
        if(!idUser){
            const error = new createError(400, 'Id user cannot be empty')
            return next(error)
        }
        usersModels.getUserById(idUser)
        .then(results => {
            if(results.length < 1){
                const error = new createError(400, 'Id user cannot be empty')
                return next(error)
            }
            response(res, results[0], { status: 'succeed', statusCode: 200 }, null)
        })
        .catch(() => {
            const error = new createError(500, 'Looks like server having trouble')
            return next(error)
        })
    },
    registerUsers: (req, res, next) => {
        const id = uuidv4()
        const { username, email, password } = req.body
        usersModels.checkUsers(email)
        .then((result) => {
            if (result.length > 0) {
                const error = new createError(409, `Forbidden: Email already exists. `)
                return next(error)
            }
            
            bcrypt.genSalt(10, function (err, salt) {
                bcrypt.hash(password, salt, function (err, hash) {
                    const data = {
                        id,
                        username,
                        email,
                        password: hash,
                        status: '',
                        createdAt: new Date()
                    }
                    
                    usersModels.insertUsers(data)
                    .then(() => {
                        return response(res, {message: 'User Has been created'}, {
                        status: 'succeed',
                        statusCode: 200
                    }, null)
                    })
                })
            })
        })
    },
    loginUsers: (req, res, next) => {
        const { email, password } = req.body
        usersModels.checkUsers(email)
        .then((result) => {
            const user = result[0]
            if(result.length===0){
            const error = new createError(401, 'Email or Password Wrong')
            return next(error)
        }
        if(parseInt(user.emailVerification) === 0) {
            const error = new createError(401, 'Email has not been verified')
            return next(error)
        }
        // compare/verify password
        bcrypt.compare(password, user.password, function (err, resCheck) {
            if (!resCheck) {
                const error = new createError(401, `Password Wrong `)
                return next(error)
            }
            delete user.password
            delete user.roleID
            delete user.updatedAt
            delete user.createdAt
            console.log(user)
            // jsonwebtoken
            // accessToken 
            jwt.sign({ userId: user.id, email: user.email }, process.env.ACCESS_TOKEN_KEY, { expiresIn: '24h' }, function (err, accessToken) {
                // refreshtoken
                jwt.sign({ userId: user.id, email: user.email }, process.env.REFRESH_TOKEN_KEY, { expiresIn: '48h' }, function (err, refreshToken) {
                    const responseMessage = {
                        id: user.id,
                        accessToken: accessToken,
                        refreshToken: refreshToken
                    }
                    return response(res, responseMessage, {
                        status: 'succeed',
                        statusCode: 200
                    }, null)
                })
            })
        })
        })
    },
    updatePhotoProfile: (req, res, next) => {
        const id = req.params.idUser

        data = {
            picture: `${process.env.BASE_URL}/upload/${req.file.filename}`
        }
        usersModels.updatePhotoProfile(id, data)
        .then(result => {
            const resultUser = result
            response(res, {message: 'Data has been updated'}, {
                status: 'succeed',
                statusCode: 200
            }, null)
        })
        .catch(err => {
            console.log(err)
            const error = new createError(500, 'Looks like server having trouble')
            return next(error)
        })
    },
    updatePhones: (req, res, next) => {
        const id = req.params.idUser
        const { phonenumber } = req.body
        const data = {
            phonenumber
        }
        usersModels.updatePhones(id, data)
        .then(result => {
            const resultUser = result
            response(res, {message: 'Data has been updated'}, {
                status: 'succeed',
                statusCode: 200
            }, null)
        })
        .catch(err => {
            console.log(err)
            const error = new createError(500, 'Looks like server having trouble')
            return next(error)
        })
    },
    onlineUser: (req, res, next) => {
        const id = req.params.idUser
        usersModels.updateStatusOnline(id)
        .then(result => {
            const resultUser = result
            response(res, {message: 'Status user has been updated (Online)'}, {
                status: 'succeed',
                statusCode: 200
            }, null)
        })
        .catch(err => {
            console.log(err)
            const error = new createError(500, 'Looks like server having trouble')
            return next(error)
        })
    },
    offlineUser: (req, res, next) => {
        const id = req.params.idUser
        usersModels.updateStatusOffline(id)
        .then(result => {
            const resultUser = result
            response(res, {message: 'Status user has been updated (Offline)'}, {
                status: 'succeed',
                statusCode: 200
            }, null)
        })
        .catch(err => {
            console.log(err)
            const error = new createError(500, 'Looks like server having trouble')
            return next(error)
        })
    },
    updateBio: (req, res, next) => {
        const id = req.params.idUser
        const { bio } = req.body
        const data = {
            bio
        }
        usersModels.updateBio(id, data)
        .then(result => {
            const resultUser = result
            response(res, {message: 'Data has been updated'}, {
                status: 'succeed',
                statusCode: 200
            }, null)
        })
        .catch(err => {
            console.log(err)
            const error = new createError(500, 'Looks like server having trouble')
            return next(error)
        })
    },
    deleteUser: (req, res, next) => {
        const id = req.params.idUser
        usersModels.deleteUser(id)
        .then(result => {
            const resultUser = result
            response(res, {message: 'Delete success'}, {
                status: 'succeed',
                statusCode: 200
            }, null)
        })
        .catch(err => {
            console.log(err)
            const error = new createError(500, 'Looks like server having trouble')
            return next(error)
        })
    }
}

module.exports = usersController