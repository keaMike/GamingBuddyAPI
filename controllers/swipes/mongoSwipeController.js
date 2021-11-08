const repo = require('../../database/mongoRepo')
const ObjectId = require('mongodb').ObjectId
const {
    hashPassword,
    verifyPassword,
    signToken,
} = require('../../utils/encryption')
const userCollection = 'users'
const swipeCollection = 'swipes'

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

exports.swipeOnUser = async (req, res) => {
    const { id } = req.user
    const otherUserId = req.query.otherUserId

    repo.insertOne(swipeCollection, { 
        createdAt: Date.now(),
        sender_id: id,
        receiver_id: otherUserId
     }).then(() => {
         return res.status(200).json({ data: 'Swiped on user' })
     }).catch(error => {
        return res.status(500).json({ data: `Something went wrong, please try again. ${error}` })
     })
}