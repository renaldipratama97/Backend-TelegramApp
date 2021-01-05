const { actionQuery } = require('../helpers/actionQuery')

const usersModels = {
    getAllUsers: () => {
        return actionQuery('SELECT * FROM users')
    },
    getFriendList: (idUser) => {
        return actionQuery('SELECT * FROM users WHERE id != ?', idUser)
    },
    getUserById: (idUser) => {
        return actionQuery('SELECT * FROM users WHERE id = ?', idUser)
    },
    checkUsers: (email) => {
        return actionQuery('SELECT * FROM users WHERE email = ?', email)
    },
    insertUsers: (data) => {
        return actionQuery('INSERT INTO users SET ?', data)
    },
    deleteUser: (idUser) => {
        return actionQuery('DELETE FROM users WHERE id = ?', idUser)
    },
    updatePhones: (id, data) => {
        return actionQuery(`UPDATE users SET ? WHERE id = ?`, [data,id])
    },
    updateBio: (id, data) => {
        return actionQuery(`UPDATE users SET ? WHERE id = ?`, [data,id])
    },
    updatePhotoProfile: (id, data) => {
        return actionQuery(`UPDATE users SET ? WHERE id = ?`, [data, id])
    },
    updateStatusOnline: (id) => {
        return actionQuery(`UPDATE users SET status = 'Online' WHERE id = ?`, id)
    },
    updateStatusOffline: (id) => {
        return actionQuery(`UPDATE users SET status = 'Offline' WHERE id = ?`, id)
    },
    deleteUser: (id) => {
        return actionQuery(`DELETE FROM users WHERE id = ?`, id)
    }
}

module.exports = usersModels