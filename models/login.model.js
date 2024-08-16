const db = require('../db');

function login({ username }) {
    const result = db.user.findFirst({
        where: {
            username
        }
    });

    return result;
}

module.exports = {
    login
}