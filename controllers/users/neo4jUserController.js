const neo4j = require('neo4j-driver')
const { driver } = require('../../database/neo4jConfig')
const {
    hashPassword,
    verifyPassword,
    signToken,
} = require('../../utils/encryption')

exports.getUsers = async (req, res) => {
    const session = driver.session()
    const { id } = req.user

    session.run('MATCH (u:User) WHERE ID(u) <> $idParam RETURN(u)', {
        idParam: neo4j.int(id)
    })
        .then(result => {
            const resultData = []
            result.records.forEach(record => {
                const data = record._fields[0].properties
                resultData.push({
                    bio: data.bio,
                    username: data.username
                })
            })
            session.close()
            return res.status(200).json({ data: resultData })
        }).catch(error => {
        session.close()
        return res.status(500).json({ data: `Something went wrong, please try again. ${error}` })
    })
}

exports.getUserById = async (req, res) => {
    const session = driver.session()
    const { id } = req.params

    getUserById(id, session, res)
}

exports.getOwnUser = async (req, res) => {
    const session = driver.session()
    const { id } = req.user

    getUserById(id, session, res)
}

function getUserById(id, session, res) {
    // TODO user_profile
    
    session.run('MATCH (u:User) WHERE ID(u) = $idParam RETURN(u)', {
        idParam: neo4j.int(id)
    }).then(result => {
        console.log(result.summary.query)
        const user = result.records[0]._fields[0].properties
        if (user) {
            session.close()
            return res.status(200).json({ data: user })
        } else {
            session.close()
            return res.status(404).json({ data: 'Could not find user with that ID' })
        }
    }).catch(error => {
        session.close()
        return res.status(500).json({ data: `Something went wrong, please try again. ${error}` })
    })
}

exports.signUp = async (req, res) => {
    const session = driver.session()
    const { username, email, password, bio } = req.body

    session.run(
        'MATCH(n:User) ' +
        'WHERE n.email = $emailParam OR n.username = $usernameParam ' +
        'RETURN (n)',
        {
            emailParam: email,
            usernameParam: username
        }
    ).then(async results => {
        if (results.records.length !== 0) {
            return res.status(400).json({data: 'User with that email or username already exists'})
        } else {
            const hash = await hashPassword(password)

            const user = {
                username,
                email,
                password: hash,
                bio
            }

            session.run(
                'CREATE (n:User $userParam) RETURN (n)',
                {
                    userParam: user
                }
            ).then(results => {
                session.close()
                return res.status(201).json(
                    { data: 'Your account has been created' }
                )
            }).catch(error => {
                session.close()
                return res.status(500).json({ data: `Could not create user. ${error}`})
            })
        }
    }).catch(error => {
        session.close()
        return res.status(500).json({ data: `Something went wrong, please try again. ${error}` })
    })
}

exports.signIn = async (req, res) => {
    const session = driver.session()
    const { email, password } = req.body

    if (!email || !password) {
        return res.status(404).json({ data: 'Please fill you both fields' })
    }

    session.run('MATCH(u:User) WHERE u.email = $emailParam RETURN u',
        {
            emailParam: email
        }).then(async result => {
        const user = result.records[0]._fields[0].properties
        const hash = user.password
        if (hash) {
            const isValid = await verifyPassword(password, hash)
            if (isValid) {
                delete user.password
                const userId = neo4j.int(result.records[0]._fields[0].identity).toInt()
                const token = signToken(userId)
                await session.close()
                return res.status(200).json({ token, user })
            } else {
                await session.close()
                return res.status(401).json({ data: 'Can not authenticate you' })
            }
        } else {
            await session.close()
            return res.status(400).json({ data: 'Email has not been registered' })
        }
    }).catch(error => {
        session.close()
        return res.status(500).json({ data: `Something went wrong, please try again. ${error}` })
    })
}

exports.addGameToUser = async (req, res) => {
    const session = driver.session()
    const { id } = req.user
    const game = req.body.game.name
    const rank = req.body.game.rank

    session.run(
        'MATCH' +
        '(u:User), ' +
        '(g:Game) ' +
        'WHERE ID(u) = $idParam AND g.name = $gameNameParam ' +
        'CREATE (u)-[:PLAYS { rank: $rankParam }]->(g) ' +
        'RETURN u, g',
        {
            idParam: neo4j.int(id),
            gameNameParam: game,
            rankParam: rank
        }
    ).then(result => {
        const data = result.records[0]._fields
        if (data.length !== 0) {
            session.close()
            return res.status(200).json({ data: 'Game added' })
        } else {
            session.close()
            return res.status(500).json({ data: `Something went wrong, please try again.` })
        }
    }).catch(error => {
        session.close()
        return res.status(500).json({ data: `Something went wrong, please try again. ${error}` })
    })
}

exports.addPlatformToUser = async (req, res) => {
    const session = driver.session()
    const { id } = req.user
    const platform = req.body.platform.platformName
    const gamertag = req.body.platform.gamertag

    session.run(
        'MATCH' +
        '(u:User), ' +
        '(p:Platform) ' +
        'WHERE ID(u) = $idParam AND p.name = $platformNameParam ' +
        'CREATE (u)-[:HAS_USER_ON { gamertag: $gamertagParam }]->(p) ' +
        'RETURN u, p',
        {
            idParam: neo4j.int(id),
            platformNameParam: platform,
            gamertagParam: gamertag
        }
    ).then(result => {
        const data = result.records[0]._fields
        if (data.length !== 0) {
            session.close()
            return res.status(200).json({ data: 'Platform added' })
        } else {
            session.close()
            return res.status(500).json({ data: `Something went wrong, please try again.` })
        }
    }).catch(error => {
        session.close()
        return res.status(500).json({ data: `Something went wrong, please try again. ${error}` })
    })
}