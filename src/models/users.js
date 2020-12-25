const { actionQuery } = require('../helpers/actionQuery')

const usersModels = {
    checkUsers: (email) => {
        return actionQuery('SELECT * FROM users WHERE email = ?', email)
    },
    insertUsers: (data) => {
        return actionQuery('INSERT INTO users SET ?', data)
    },
    deleteUser: (idUser) => {
        return actionQuery('DELETE FROM users WHERE id = ?', idUser)
    },
    updateUser: (id, data) => {
        return actionQuery(`UPDATE users SET email = '${data.email}', phoneNumber = '${data.phoneNumber}', gender = '${data.gender}', username = '${data.username}', firstName = '${data.firstName}', lastName = '${data.lastName}', bornDate = '${data.bornDate}', address = '${data.address}', photoProfile = '${data.photoProfile}', updatedAt = '${data.updatedAt}' WHERE id = ?`, id)
    }
}

module.exports = usersModels