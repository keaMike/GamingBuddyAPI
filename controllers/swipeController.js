const { driver } = require('../database/neo4jConfig')
const { getUsersFromIds } = require('./userController')

exports.findMatches = async (req, res) => {
    const session = driver.session()
    const { id } = req.user

    session.run(
        'MATCH ' +
        '(u:SimpleUser), ' +
        '(users:SimpleUser) ' +
        'WHERE u.id = $idParam AND ' +
        '(u)-[:HAS_SWIPED_ON]->(users) AND ' +
        '(users)-[:HAS_SWIPED_ON]->(u) ' +
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
        getUsersFromIds(ids, (results) => {
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

exports.swipeOnUser = async (req, res) => {
    const session = driver.session()
    const { id } = req.user
    const otherUserId = req.body.otherUserId

    session.run(
        'MERGE(u:SimpleUser { id: $idParam }) ' +
        'MERGE(otherUser:SimpleUser { id: $otherUserIdParam }) ' +
        'CREATE (u)-[:HAS_SWIPED_ON { timeStamp: timestamp() }]->(otherUser)', 
        {
            idParam: id,
            otherUserIdParam: otherUserId
        }
        ).then(() => {
            session.close()
            return res.status(200).json({ data: 'Swiped on user' })
        }).catch(error => {
            session.close()
            return res.status(500).json({ data: `Something has gone wrong, please try again. ${error}` })
        })
    
}