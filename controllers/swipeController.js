const { driver } = require('../database/neo4jConfig')
const userController = require('./userController')

exports.findMatches = async (req, res) => {
    const session = driver.session()
    const { id } = req.user

    session.run(
        'MATCH ' +
        '(u:SimpleUser), ' +
        '(users:SimpleUser) ' +
        'WHERE u.id = $idParam AND ' +
        '(u)-[:HAS_SWIPED_ON { status: true }]->(users) AND ' +
        '(users)-[:HAS_SWIPED_ON { status: true }]->(u) ' +
        'RETURN (users)', 
        {
            idParam: id
        }
    ).then(result => {
        const ids = []
        result.records.forEach(record => {
            const data = record._fields[0].properties
            ids.push(data.id)
        })
        userController.getUsersFromIds(ids, (results) => {
            session.close()
            if (results.length !== 0) {
                return res.status(200).json({ data: results })
            } else {
                return res.status(404).json({ data: 'No matches' })
            }
        })
    }).catch(error => {
        session.close()
        return res.status(500).json({ data: `Something went wrong, please try again. ${error}` })
    })
}

exports.findUsersSwipedOn = async (id, callback) => {
    const session = driver.session()

    await session.run(
        'MATCH ' +
        '(u:SimpleUser), ' +
        '(users:SimpleUser) ' +
        'WHERE u.id = $idParam AND ' +
        '(u)-[:HAS_SWIPED_ON]->(users) ' +
        'RETURN (users)', 
        {
            idParam: id
        }
    ).then(async (result) => {
      const ids = []
      result.records.forEach(record => {
        const data = record._fields[0].properties
        ids.push(data.id)
      })
      callback(ids)
    })
}

exports.swipeOnUser = async (req, res) => {
    const session = driver.session()
    const { id } = req.user
    const otherUserId = req.body.otherUserId
    const swipeStatus = req.body.status

    session.run(
        'MERGE(u:SimpleUser { id: $idParam }) ' +
        'MERGE(otherUser:SimpleUser { id: $otherUserIdParam }) ' +
        'CREATE (u)-[:HAS_SWIPED_ON { timeStamp: timestamp(), status: $status }]->(otherUser)', 
        {
            idParam: id,
            otherUserIdParam: otherUserId,
            status: swipeStatus
        }
        ).then(() => {
            session.close()
            return res.status(200).json({ data: 'Swiped on user' })
        }).catch(error => {
            session.close()
            return res.status(500).json({ data: `Something has gone wrong, please try again. ${error}` })
        })
    
}