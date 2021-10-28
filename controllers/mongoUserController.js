const repo = require('../database/mongoRepo')
const {
    hashPassword,
    verifyPassword,
    signToken,
} = require('../utils/encryption')

exports.getUsers = async (req, res) => {
    repo.find('users', {})
        .then(results => {
            res.status(200).json({data: results})
        }).catch(error => {
            res.status(500).json({ data: 'Something went wrong, please try again' })
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