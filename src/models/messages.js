const { actionQuery } = require('../helpers/actionQuery')

const messagesModels = {
    insertMessages: (data) => {
        return actionQuery('INSERT INTO messages SET ?', data)
    },
    getMessages: (id, data) => {
    }
}

module.exports = messagesModels