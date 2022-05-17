const repo = require('../database/mongoRepo')
const userController = require('./userController')
const messageCollection = 'messages'

exports.sendMessage = (req, res) => {
  const ownId = req.user.id
  const receiverId = req.body.receiverId
  const content = req.body.content

  repo
    .insertOne(messageCollection, {
      senderId: ownId,
      receivingId: receiverId,
      content,
      insertedAt: Date.now(),
    })
    .then(({ insertedId }) => {
      return res.status(201).json({ data: insertedId })
    })
    .catch((error) => {
      return res.status(500).json({ data: 'Could not sent message' })
    })
}

exports.getAllMessages = (req, res) => {
  const { id } = req.user
  const { recepient } = req.query

  repo
    .find(messageCollection, {
      $and: [
        { $or: [{ senderId: id }, { receivingId: id }] },
        { $or: [{ senderId: recepient }, { receivingId: recepient }] },
      ],
    })
    .then((results) => {
      const ids = new Set()

      // Get user ids that are not the users own id
      results.map((result) => {
        if (result.senderId !== id) ids.add(result.senderId)
        if (result.receivingId !== id) ids.add(result.receivingId)
      })

      // Get user information
      userController.getUsersFromIds([...ids], (userResults) => {
        const messages = []

        // NOT good code - but not the prioty
        results.map((result) => {
          let userObject
          let sent

          if (result.senderId !== id) {
            userObject = userResults.find((user) => user.id === result.senderId)
            sent = false
          }
          if (result.receivingId !== id) {
            userObject = userResults.find(
              (user) => user.id === result.receivingId
            )
            sent = true
          }

          messages.push({
            id: result._id,
            user: {
              id: userObject.id,
              username: userObject.username,
            },
            content: result.content,
            sentAt: result.insertedAt,
            sent,
          })
        })

        return res.status(200).json({ data: messages })
      })
    })
    .catch((error) => {
      return res
        .status(500)
        .json({ data: `Something went wrong, please try again. ${error}` })
    })
}
