const { driver } = require('../database/neo4jConfig')

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
        const resultData = []
        const ids = []
        result.records.forEach(record => {
            const data = record._fields[0].properties
            ids.push(data.id)
        })
        // TODO fetch user info from ids and make resultdata array
        session.close()
        if (resultData.length !== 0) {
            return res.status(200).json({ data: resultData })
        } else {
            return res.status(404).json({ data: 'No matches' })
        }
    }).catch(error => {
        session.close()
        return res.status(500).json({ data: `Something went wrong, please try again. ${error}` })
    })
}

exports.swipeOnUser = async (req, res) => {
    const session = driver.session()
    const { id } = req.user
    const otherUserId = req.query.otherUserId

    session.run(
        'MATCH ' +
        '(u:SimpleUser), ' +
        '(otherUser:SimpleUser) ' +
        'WHERE ID(u) = $idParam ' +
        'AND ID(otherUser) = $otherUserIdParam ' +
        'CREATE (u)-[:HAS_SWIPED_ON]->(otherUser)', 
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