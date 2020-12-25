const createError = require('http-errors')
const bcrypt = require('bcrypt')
const { v4: uuidv4 } = require('uuid')
const jwt = require('jsonwebtoken')
const { response } = require('../helpers/response')

const usersModels = require('../models/users')

const usersController =  {
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
    }
}

module.exports = usersController