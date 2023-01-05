const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const userModel = require('../models/userModel')

module.exports = {
    authontication: (req, res, next) => {
        try {
            let token = req.headers['token']
            if (!token) {
                return res.status(400).send({ status: false, message: "Token is missing" }) 
            }
            jwt.verify(token, "Secret_Key", function (error, decoded) {
                if (error) {
                    return res.status(400).send({ status: false, msg: "Authentication Failed" })
                } else {
                    req.decodedToken = decoded
                    next()
                }
            })
        } catch (error) {
            return res.status(500).send({ status: false, message: error.message })
        }
    },


    authorise: async (req, res, next) => {
        try {
            let ObjectID = mongoose.Types.ObjectId
            let userId = req.params.userId
            if (!userId) {
                return res.status(400).send({ status: false, msg: "Please enter UserId" })
            }
            if (!ObjectID.isValid(userId)) { 
                return res.status(400).send({ status: false, message: "Not a valid UserId" }) 
            }
            let userData = await userModel.findOne({_id: userId , isDeleted : false})
            if (!userData) {
                return res.status(404).send({ status: false, msg: "User not found" })
            }
            if (userId != req.decodedToken.userId) {
                return res.status(403).send({ status: false, message: "Unauthorized person" })
            }
            return next()
        }
        catch (error) {
            res.status(500).send({ status: false, message: error.message })
        }
    }
}