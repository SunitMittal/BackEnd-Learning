const mongoose = require('mongoose')

const hospitalSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    addressLine1: {
        type: String,
        required: true
    },
    addressLine2: {
        type: String,
    },
    city: {
        type: String,
        required: true
    },
    pincode: {
        type: String,   //generally pincode number type hi hota hai, but kyuki subcontinent ke baar pincode mee characters bhi included hote hai, to better hai type string rakhe, taki yo numbers walle aur (char+num) walle pincode dono ko with ease store kar sake
        required: true
    },
    specializedIn: [{
        type: String,
    }],

}, { timestamps: true })

export const Hospital = mongoose.model('Hospital', hospitalSchema)