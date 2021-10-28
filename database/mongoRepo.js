const MongoDB = require('mongodb');

const queryPromise = async function (queryType, collectionName, query, data) {
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
                    case 'updateOne'    :   collection.updateOne(query, data, dbCallback)
                                            break
                    case 'updateMany'   :   collection.updateMany(query, data, dbCallback)
                                            break
                    case 'deleteOne'    :   collection.deleteOne(query, dbCallback)
                                            break
                    case 'deleteMany'   :   collection.deleteMany(query, dbCallback)
                                            break
                    case 'find'         :   collection.find(query).toArray(dbCallback)
                                            break
                    default             :   console.log('Wrong query type')
                                            break
                }
        })
    })
}

async function find(collectionName, query) {
    return await queryPromise('find', collectionName, query)
}

async function insertOne(collectionName, data) {
    return await queryPromise('insertOne', collectionName, null, data)
}

async function update(collectionName, query, data) {
    return await queryPromise('updateOne', collectionName, query, data)
}

async function deleteOne(collectionName, query) {
    return await queryPromise('deleteOne', collectionName, query)
}

async function deleteMany(collectionName, query) {
    return await queryPromise('deleteMany', collectionName, query)
}

module.exports = {
    find,
    insertOne,
    update,
    deleteOne,
    deleteMany
}