const mongoose = require('mongoose')

const orderItemSchema = new mongoose.Schema({
    productId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Product'
    },
    quntity:{
        type:Number,
        required:true
    }
})

const orderSchema = new mongoose.Schema({
    orderPrice:{
        type:Number,
        required:true
    },
    customer:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    orderItems:{
        type:[orderItemSchema]      //this is the way to store array of elements (syntax: [dataType]), here we are storing objectIds, of orderItemSchema
        // we can also create array of objects like we did in todo's(in file todo.model.js)
    },
    address:{
        type:String,
        required:true
    },
    status:{
        type:String,
        enum:['PENDING', 'CANCELLED', 'DELIVERED'],     //enum(means enumerations), using it we make sure that value can only choose from the predefined option, matlab jaise yaha humne enum ko use karke values ko restrict kar diya, ki value kewal 'PENDING', 'CANCELLED' or 'DELIVERED' mee se hi hogi, isske alawa koi aur value store nahi hoo sakti
        default:'PENDING'
    }
}, {timestamps:true})

export const Category = mongoose.model('Order', orderSchema)

// In a single file we can create any number of Schema's but its not a good practise untill the schema is not required by any other file....jaise humne yaha kiya hai orderItemSchema kewal orderSchema mee hi kaa aayega, kahi aur nahii, to usse yahi bana liya aur use kar liya