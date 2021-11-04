const { driver } = require('../../database/neo4jConfig')
const {
    hashPassword,
    verifyPassword,
    signToken,
} = require('../../utils/encryption')

exports.getUsers = async (req, res) => {
    const session = driver.session()

    session.run('MATCH(n:User) RETURN(n)')
        .then(result => {
          session.close()
        })
}

exports.getUserById = async (req, res) => {
    // TODO
}

exports.getOwnUser = async (req, res) => {
    // TODO
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
    })
}

exports.signIn = async (req, res) => {
    // TODO
}

exports.addGameToUser = async (req, res) => {
    // TODO
}

exports.addPlatformToUser = async (req, res) => {
    // TODO
}

exports.findMatches = async (req, res) => {
    // TODO
}