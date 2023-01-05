const mongoose = require('mongoose')
const moment = require('moment')

const userSchema = new mongoose.Schema({
    title: {
        type: String,
        enum: ['Mr','Miss','Mrs'],
        required: true
    },
    userName: {
        type: String,
        required: true,
        trim: true
    },
    gender: {
        type: String,
        enum: ['male', 'female', 'LGBTQ'],
        required: true
    },
    phone: {
        type: String,
        require: true,
        unique: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
        trim: true
    },
    place: {
        type: String,
        trim: true
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: String,
        default: moment().format("DD-MM-YYYY  h:mm:ss a")
    },
    updatedAt: {
        type: String,
        default: null
    },
    deletedAt: {
        type: String,
        default: null
    }
})

module.exports = mongoose.model('User', userSchema)