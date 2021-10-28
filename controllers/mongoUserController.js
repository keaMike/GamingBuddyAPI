const repo = require('../database/mongoRepo')
const ObjectId = require('mongodb').ObjectId
const {
    hashPassword,
    verifyPassword,
    signToken,
} = require('../utils/encryption')

exports.getUsers = async (req, res) => {
    const { ownId } = req.query
    const query = ownId ? {_id: {$ne: ObjectId(ownId)}} : {}
    repo.find('users', query)
        .then(results => {
            res.status(200).json({data: results})
        }).catch(error => {
            res.status(500).json({ data: `Something went wrong, please try again. ${error}` })
    })
}

exports.getUserById = async (req, res) => {

}

exports.getOwnUser = async (req, res) => {

}

exports.signUp = async (req, res) => {

}

exports.signIn = async (req, res) => {

}