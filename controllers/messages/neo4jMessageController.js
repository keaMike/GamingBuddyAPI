const neo4j = require('neo4j-driver')
const { driver } = require('../../database/neo4jConfig')
const {
    hashPassword,
    verifyPassword,
    signToken,
} = require('../../utils/encryption')

exports.sendMessage = (req, res) => {
    const session = driver.session()
    const ownId = req.user.id
    const receiverId = req.body.receiverId
    const content = req.body.content

    session.run(
      'MATCH ' +
      '(sender:User), ' +
      '(receiver:User) ' +
      'WHERE ID(sender) = $senderIdParam ' +
      'AND ID(receiver) = $receiverIdParam ' +
      'CREATE (m:Message { content: $contentParam, sentAt: timestamp() }) ' +
      'CREATE (sender)-[:SENT_MESSAGE]->(m) ' +
      'CREATE (m)-[:SENT_TO]->(receiver)', 
      {
        senderIdParam: neo4j.int(ownId),
        receiverIdParam: neo4j.int(receiverId),
        contentParam: content
      }
    ).then(() => {
      session.close()
      return res.status(201).json({ data: 'Message sent' })
    }).catch(error => {
      session.close()
      return res.status(500).json({ data: `Something went wrong, please try again. ${error}` })
    })
}

exports.getAllMessages = (req, res) => {
  const session = driver.session()
  const { id } = req.user

  session.run(
    'MATCH ' +
    '(u:User), ' +
    '(messages:Message) ' +
    'WHERE ID(u) = $idParam ' + 
    '((u)-[:SENT_MESSAGE]->(messages) OR ' +
    '(messages)-[:SENT_TO]->(u)) ' +
    'RETURN (messages)',
    {
      idParam: id
    }
    ).then(result => {
      const resultData = []
      result.records.forEach(record => {
        const data = record._fields[0].properties
        resultData.push({
          content: data.content,
          sentAt: data.sentAt
        })
      })
      session.close()
      return res.status(200).json({ data: resultData })
    }).catch(error => {
      session.close()
      return res.status(500).json({ data: `Something went wrong, please try again. ${error}` })
    })
}