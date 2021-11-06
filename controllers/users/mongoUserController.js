const repo = require('../../database/mongoRepo')
const ObjectId = require('mongodb').ObjectId
const {
    hashPassword,
    verifyPassword,
    signToken,
} = require('../../utils/encryption')
const userCollection = 'users'
const swipeCollection = 'swipes'

exports.getUsers = async (req, res) => {
    const { ownId } = req.query
    const query = ownId ? {_id: {$ne: ObjectId(ownId)}} : {}
    repo.find(userCollection, query)
        .then(results => {
            return res.status(200).json({data: results})
        }).catch(error => {
            return res.status(500).json({ data: `Something went wrong, please try again. ${error}` })
    })
}

exports.getUserById = async (req, res) => {
    const { id } = req.params

    // TODO user_profile

    repo.find(userCollection, { id: id })
        .then(results => {
            return res.status(200).json({data: results})
        }).catch(error => {
            return res.status(500).json({ data: `Something went wrong, please try again. ${error}` })
    })
}

exports.getOwnUser = async (req, res) => {
    const { id } = req.user
    repo.find(userCollection, { id: id })
        .then(results => {
            return res.status(200).json({data: results})
        }).catch(error => {
            return res.status(500).json({ data: `Something went wrong, please try again. ${error}` })
    })
}

exports.signUp = async (req, res) => {
    const { username, email, password, bio } = req.body
    repo.find(userCollection, { $or: [{ email: email }, { username: username }] })
        .then(async results => {
            if (results.length !== 0) {
                return res.status(400).json({data: 'User with that email or username already exists'})
            } else {
                const hash = await hashPassword(password)
                repo.insertOne('users', {
                    username,
                    email,
                    password: hash,
                    bio,
                    games: [],
                    platforms: []
                }).then(() => {
                    return res.status(201).json({ data: 'Your account has been created' })
                }).catch(error => {
                    return res.status(500).json({ data: `Could not create user. ${error}`})
                })
            }
        }).catch(error => {
            return res.status(500).json({ data: `Something went wrong, please try again. ${error}` })
    })
}

exports.signIn = async (req, res) => {
    const { email, password } = req.body

    if (!email || !password) {
        return res.status(404).json({ data: 'Please fill you both fields' })
    }

    repo.find(userCollection, { email: email })
        .then(async results => {
            const user = results[0]
            if (!user) return res.status(400).json({ data: 'No user found with that email.' })
            const hash = user.password
            if (hash) {
                const isValid = await verifyPassword(password, hash)
                if (isValid) {
                    delete user.password
                    const token = await signToken(user._id)
                    return res.status(200).json({ token, user })                }
            }
        }).catch(error => {
            return res.status(500).json({ data: `Something went wrong, please try again. ${error}` })
    })
}

exports.addGameToUser = async (req, res) => {
    const { id } = req.user
    const game = req.body.game

    repo.update(userCollection, { _id: ObjectId(id) }, { $push: { games: game } })
        .then(() => {
            return res.status(204).json({ data: 'Game added to user' })
        }).catch(error => {
            return res.status(500).json({ data: `Something went wrong, please try again. ${error}` })
    })
}

exports.addPlatformToUser = async (req, res) => {
    const { id } = req.user
    const platform = req.body.platform

    repo.update(userCollection, { _id: ObjectId(id) }, { $push: { platforms: platform } })
        .then(() => {
            return res.status(204).json({ data: 'Platform added to user' })
        }).catch(error => {
            return res.status(500).json({ data: `Something went wrong, please try again. ${error}` })
    })
}

exports.findMatches = async (req, res) => {
    const { id } = req.user

    // Find all swipes the user has made
    repo.find(swipeCollection, { sender_id: ObjectId(id) })
        .then(async swipes => {
            if (swipes.length === 0) {
                return res.status(400).json({data: "You haven't swiped on anyone. Get to it!"})
            } else {
                const receiverIDs = []

                swipes.map(swipe => {
                    receiverIDs.push(ObjectId(swipe.receiver_id))
                })

                // Of the swipes the user has made, find who has swiped on the user (who has matched)
                repo.find(swipeCollection, {receiver_id: ObjectId(id), sender_id: { $in: receiverIDs }})
                    .then(matches => {
                        const matchIDs = []

                        if (matches.length === 0) {
                            return res.status(200).json({data: 'No matches...'})
                        } else {
                            matches.map(match => {
                                matchIDs.push(ObjectId(match.sender_id))
                            })

                            const userMatches = []

                            // Find relevant information about the matches
                            repo.find(userCollection, {_id: { $in: matchIDs }})
                                .then(results => {
                                    const match = results[0]
                                    userMatches.push({
                                        username: match.username,
                                        games: match.games,
                                        platforms: match.platforms
                                    })

                                    return res.status(200).json({ data: userMatches })
                                })
                        }
                    })
            }
        }).catch(error => {
            return res.status(500).json({ data: `Something went wrong, please try again. ${error}` })
    })
}