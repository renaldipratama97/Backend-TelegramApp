require('dotenv').config()
const express = require('express')
const app = express()
const morgan = require('morgan')
const bodyParser = require('body-parser')
const { response } = require('./src/helpers/response')
const cors = require('cors') 
const messagesModels = require('./src/models/messages')
const usersModels = require('./src/models/users')
const usersRoute = require('./src/routers/users')
const messagesRoute = require('./src/routers/messages')
// parse application/json
app.use(bodyParser.json())
app.use(morgan('dev'))
// Using CORS
app.use(cors())
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
const http = require('http')
const server = http.createServer(app)
const socket = require('socket.io')

const io = socket(server, {
    cors: {
        origin: '*'
    }
})

io.on("connection", (socket) => {
    console.log('ada client yang connect ' + socket.id)

    socket.on('setupUserLogin', idUser => {
        console.log(`User ${idUser.toString()} telah login`)
        usersModels.updateStatusOnline(idUser)
    })

    socket.on('setupUserLogout', idUser => {
        console.log(`User ${idUser.toString()} telah logout`)
        usersModels.updateStatusOffline(idUser)
    })

    socket.on('setupUserJoin', data => {
        socket.join('user: ' + data.senderId)
    })

    socket.on('sendMessage', (data, callback) => {
        const dataMessages = {
            message: data.message,
            senderId: data.senderId,
            receiverId: data.receiverId,
            createdAt: data.time
        }
        callback(data)
        messagesModels.insertMessages(dataMessages)
        .then((result => {
            io.to('user: ' + data.receiverId).emit('repeatSendMessage', data)  
        }))
        .catch((err => {

        }))
    })

    socket.on("disconnect", () => {
        console.log('clien terputus')
    })
})

// Grouping End-Point
app.use('/users', usersRoute)
app.use('/messages', messagesRoute)

app.use('/upload', express.static('./uploads'))

// Default Response Unknown End-Point
app.use('*', (req, res) => {
})

// Error Handling
app.use((err, req, res, next) => {
    response(res, null, { status: err.status || 'Failed', statusCode: err.statusCode || 400 }, { message: err.message })
})

server.listen(process.env.PORT, () => console.log('Server running on port : '+ process.env.PORT))