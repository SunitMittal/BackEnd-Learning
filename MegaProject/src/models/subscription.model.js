const mongoose = require('mongoose')

const subscriptionModel = new mongoose.Schema({
    subscriber:{
        type:mongoose.Schema.Types.ObjectId(),
        ref:'User'
    }
}, {timestamps:true})

const Subscription = mongoose.model('Subscription', subscriptionModel)

module.exports = Subscription