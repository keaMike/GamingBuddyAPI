const neo4j = require('neo4j-driver')
const { driver } = require('../../database/neo4jConfig')
const {
    hashPassword,
    verifyPassword,
    signToken,
} = require('../../utils/encryption')

exports.findMatches = async (req, res) => {
    const session = driver.session()
    const { id } = req.user

    session.run(
        'MATCH ' +
        '(u:User), ' +
        '(users:User) ' +
        'WHERE ID(u) = $idParam AND ' +
        '(u)-[:HAS_SWIPED_ON]->(users) AND ' +
        '(users)-[:HAS_SWIPED_ON]->(u) ' +
        'RETURN (users)', 
        {
            idParam: neo4j.int(id)
        }
    ).then(result => {
        const resultData = []
        result.records.forEach(record => {
            const data = record._fields[0].properties
            resultData.push({
                bio: data.bio,
                username: data.username
            })
        })
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
    // TODO implement
    return res.status(501).json({ data: 'Not yet implemented' })
}