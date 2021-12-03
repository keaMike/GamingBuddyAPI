const repo = require('../database/mongoRepo')
const messageCollection = 'messages'

exports.sendMessage = (req, res) => {
    const ownId = req.user.id
    const receiverId = req.body.receiverId
    const content = req.body.content

    repo.insertOne(messageCollection, {
      senderId: ownId,
      receivingId: receiverId,
      content,
      insertedAt: Date.now()
    }).then(() => {
      return res.status(201).json({ data: 'Message sent' })
    }).catch(error => {
      return res.status(500).json({ data: 'Could not sent message' })
    })
}

exports.getAllMessages = (req, res) => {
  const { id } = req.user
  
  repo.find(messageCollection, {
    $or: [ { senderId: id }, { receivingId: id } ]
  }).then(results => {
    // TODO get user data from array of ids and make resultObject array
    return res.status(200).json({ data: results })
  }).catch(error => {
    return res.status(500).json({ data: `Something went wrong, please try again. ${error}` })
  })
}