const userModel = require('../models/userModel')
const jwt = require('jsonwebtoken')
const moment = require('moment')
const mongoose = require('mongoose')
const validMobile = /^([0|\+[0-9]{1,5})?([7-9][0-9]{9})$/
const validEmail = /[a-zA-Z0-9_\-\.]+[@][a-z]+[\.][a-z]{2,3}/
const passwordRegex = /^\S{8,24}$/
const nameRegex = /^[A-Za-z ]+$/

const createUser = async (req, res) => {
    try {
        let data = req.body
        let {title, userName, gender, phone, email, password} = data

        if (!title) {
            return res.status(400).send({ status: false, msg: "title is required" })
        }
        if (!['Mr','Miss','Mrs'].includes(title)) {
            return res.status(400).send({ status: false, msg: "title should be Mr or Miss or Mrs" })
        }
        if (!userName) {
            return res.status(400).send({ status: false, msg: "username is required" })
        }
        if (!nameRegex.test(userName)) {
            return res.status(400).send({ status: false, msg: "please enter a valid username" })
        }
        if (!gender) {
            return res.status(400).send({ status: false, msg: "gender is required" })
        }
        if (!['male', 'female', 'LGBTQ'].includes(gender)) {
            return res.status(400).send({ status: false, msg: "gender should be male or female or LGBTQ" })
        }
        if (!email) {
            return res.status(400).send({ status: false, msg: "emailId is required" })
        }
        if (!validEmail.test(email)) {
            return res.status(400).send({ status: false, msg: "emailId is not valid" })
        }
        if (!phone) {
            return res.status(400).send({ status: false, msg: "Phone number is required" })
        }
        if (!validMobile.test(phone)) {
            return res.status(400).send({ status: false, msg: "Phone number should be 10 digits only" })
        }
        let uniqueData = await userModel.find({ $or: [{ phone: phone }, { email: email }] })
        let arr = []
        uniqueData.map((i) => { arr.push(i.phone, i.email) })

        if (arr.includes(phone)) {
            return res.status(409).send({ status: false, msg: "phone is already exsits" })
        }
        if (arr.includes(email)) {
            return res.status(409).send({ status: false, msg: "email is already exsits" })
        }
        if (!password) {
            return res.status(400).send({ status: false, msg: "password is required" })
        }
        if (!passwordRegex.test(password)) {
            return res.status(400).send({ status: false, msg: "Password should be minimum 8 and maximum 15 character.It contains atleast--> 1 Uppercase letter, 1 Lowercase letter, 1 Number, 1 Special character" })
        }
        let createUserdata = await userModel.create(data)
        return res.status(201).send({ status: true, message: "User data created successfully", data: createUserdata })
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

const login = async (req, res) => {
    try {
        let { email, password, phone } = req.body
        if (!email && !phone) {
            return res.status(400).send({ status: false, msg: "please enter your email or phone number to login" })
        }
        if (!password) {
            return res.status(400).send({ status: false, msg: "please enter your password to login" })
        }
        let findData = await userModel.findOne({ $and: [{ $or: [{ email: email }, { phone: phone }] }, { password: password },{isDeleted: false}] })
        if (!findData) {
            return res.status(404).send({ status: false, msg: "either email or password is incorrect" })
        }
        let token = jwt.sign({ userId: findData._id }, 'Secret_Key')
        res.setHeader("token", token)
        return res.status(200).send({ status: true, msg: "LoggedIn successfully", token: token })
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

const getUser = async (req, res) => {
    try {
        let userId = req.params.userId
        let ObjectID = mongoose.Types.ObjectId
        if (!userId) {
            return res.status(400).send({ status: false, msg: "Please enter UserId to get user's details" })
        }
        if (!ObjectID.isValid(userId)) { 
            return res.status(400).send({ status: false, message: "Not a valid UserId" }) 
        }
        let userData = await userModel.findOne({_id: userId , isDeleted : false})
        if (!userData) {
            return res.status(404).send({ status: false, msg: "User not found" })
        }
        return res.status(200).send({ status: true, Data : userData })
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

const updateUser = async (req, res) => {
    try {
        let data = req.body
        let userId = req.params.userId
        // let {title, userName, gender, phone, email, password, place} = data
        data['updatedAt'] = moment().format("DD-MM-YYYY  h:mm:ss a")
        let updateData = await userModel.findOneAndUpdate({_id: userId , isDeleted : false},data,{new: true})
        return res.status(200).send({status: true, msg: "User data update successfully", Data: updateData})
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

const deleteUser = async (req, res) => {
    try {
        let userId = req.params.userId
        await userModel.findOneAndUpdate({_id: userId , isDeleted : false},{isDeleted: true,deletedAt : moment().format("DD-MM-YYYY  h:mm:ss a")})
        return res.status(200).send({status: true, msg: "User data deleted successfully"})
    } catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}
module.exports = { createUser, login, getUser, updateUser, deleteUser }