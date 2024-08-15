const db = require('../db');

function gets() {
    const result = db.post.findMany();

    return result;
}

function get(id) {
    const result = db.post.findUnique({
        where: {
            id: Number(id)
        }
    });

    return result;
}

function post(data) {
    const result = db.post.create({
        select: {
            id: true,
            title: true,
            content: true
        },
        data
    });

    return result;
}

function put(id, data) {
    const result = db.post.update({
        where: {
            id: Number(id)
        },
        data
    });

    return result;
}

function _delete(id) {
    const result = db.post.delete({
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