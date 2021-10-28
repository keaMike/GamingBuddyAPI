const MongoDB = require('mongodb');

const queryPromise = async function (queryType, collectionName, data) {
    return new Promise((resolve, reject) => {
        MongoDB.connect(
            process.env.MONGO_DB_SERVER_CONNECTION_STRING,
            { useUnifiedTopology: true },
            (error, client) => {
                if (error) throw new Error()

                const db = client.db(process.env.MONGO_DB_NAME)
                const collection = db.collection(collectionName)

                const dbCallback = (error, result) => {
                    if (error) reject()

                    client.close()

                    resolve(result)
                }

                switch (queryType) {
                    case 'insertOne'    :   collection.insertOne(data, dbCallback)
                                            break
                    case 'insertMany'   :   collection.insertMany(data, dbCallback)
                                            break
                    case 'updateOne'    :   collection.updateOne(data, dbCallback)
                                            break
                    case 'updateMany'   :   collection.updateMany(data, dbCallback)
                                            break
                    case 'deleteOne'    :   collection.deleteOne(data, dbCallback)
                                            break
                    case 'deleteMany'   :   collection.deleteMany(data, dbCallback)
                                            break
                    case 'find'         :   collection.find(data).toArray(dbCallback)
                                            break
                    default             :   console.log('Wrong query type')
                                            break
                }
        })
    })
}

const updatePromise = async function (collectionName, query, data) {
    return new Promise((resolve, reject) => {
        MongoDB.connect(process.env.MONGO_DB_SERVER_CONNECTION_STRING, { useUnifiedTopology: true }, (error, client) => {
            if (error) throw new Error();

            const db = client.db(process.env.MONGO_DB_NAME);
            const collection = db.collection(collectionName);

            collection.updateOne(query, { $set: data }, (error, result) => {
                if (error) reject(error);

                client.close();

                resolve(result);
            });
        });
    });
}

const deleteOnePromise = async function (collectionName, query) {
    return new Promise((resolve, reject) => {
        MongoDB.connect(process.env.MONGO_DB_SERVER_CONNECTION_STRING, { useUnifiedTopology: true }, (error, client) => {
            if (error) throw new Error();

            const db = client.db(process.env.MONGO_DB_NAME);
            const collection = db.collection(collectionName);

            collection.deleteOne(query, (error, result) => {
                if (error) reject(error);

                client.close();

                resolve(result);
            });
        });
    });
}

const deleteManyPromise = async function (collectionName, query) {
    return new Promise((resolve, reject) => {
        MongoDB.connect(process.env.MONGO_DB_SERVER_CONNECTION_STRING, { useUnifiedTopology: true }, (error, client) => {
            if (error) throw new Error();

            const db = client.db(process.env.MONGO_DB_NAME);
            const collection = db.collection(collectionName);

            collection.deleteMany(query, (error, result) => {
                if (error) reject(error);

                client.close();

                resolve(result);
            });
        });
    });
}

async function find(collectionName, query) {
    return await queryPromise('find', collectionName, query)
}

async function insert(collectionName, data) {
    return await queryPromise('insertOne', collectionName, data)
}

async function update(collectionName, query, data) {
    return await queryPromise('updateOne', collectionName, data)
}

async function deleteOne(collectionName, query) {
    return await queryPromise('deleteOne', collectionName, query)
}

async function deleteMany(collectionName, query) {
    return await queryPromise('deleteMany', collectionName, query)
}

module.exports = {
    find,
    insert,
    update,
    deleteOne,
    deleteMany
}