const router = require('express').Router()
const auth = require('../middleware/auth')

router.post('/db', auth.protected, (req, res) => {
    const dbChoice = req.body.db
    if (
        dbChoice === 'mongo' ||
        dbChoice === 'neo4j' ||
        dbChoice === 'mysql'
        ) {
            process.env.DB_CHOICE = dbChoice
            return res.status(200).json({ data: `DB is now: ${dbChoice}` })
        } else {
            return res.status(404).json({ data: `DB choice (${dbChoice}) is not supported.` })
        }
})

module.exports = router