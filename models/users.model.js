const db = require('../db');

function gets() {
    const result = db.user.findMany();

    return result;
}

function get(id) {
    const result = db.user.findUnique({
        where: {
            id: Number(id)
        }
    });

    return result;
}

function post(data) {
    const result = db.user.create({
        select: {
            id: true,
            username: true
        },
        data
    });

    return result;
}

function put(id, data) {
    const result = db.user.update({
        where: {
            id: Number(id)
        },
        data
    });

    return result;
}

function _delete(id) {
    const result = db.user.delete({
        where: {
            id: Number(id)
        }
    });

    return result;
}

module.exports = {
    gets,
    get,
    post,
    put,
    delete: _delete
}