const db = require('../dbConfig');
const dbName = 'users';

const findBy = filter => db(dbName).where(filter);

const create = async user => {
    const [id] = await db('users').insert(user);

    return findBy({
        id
    }).first();
}

const readAll = () => db(dbName);

const readOne = id => db(dbName).where({id}).first();

module.exports = {
    findBy,
    create,
    readAll,
    readOne
}