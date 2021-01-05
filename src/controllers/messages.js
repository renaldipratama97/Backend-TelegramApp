const { response } = require('../helpers/response')
const { v4: uuidv4 } = require('uuid')
const createError = require('http-errors')
const messagesModels = require('../models/messages')

const messagesController =  {
    insertMessages: (req, res, next) => {
        const { senderId, receiverId, message } = req.body
        const id = uuidv4()
        
        const data = {
            id,
            senderId,
            receiverId,
            message, 
            createdAt: new Date()
        }
        messagesModels.insertMessages(data)
        .then(result => {
            return response(res, {message: 'Send message success'}, {
                status: 'succeed',
                statusCode: 200
            }, null)
        })
        .catch(() =>{
            const error = new createError(500, 'Looks like server having trouble')
            return next(error)
        })
    },
    getHistoryChat: (req, res, next) => {

    }
}

module.exports = messagesController