const mongoose = require('mongoose')

const productSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    productImage:{              //images/videos Db mee store kar sakte hai par karni nahii chahiye, kyuki DB iss purpose kee liye nahii hai, ye DB kaa size unecessary heavy kar denge, hum AWS S3 bucket or Cloudinary use kar sakte hai, unme hum img/videos ko store karenge aur uska URL DB me store kar lenge 
        type:String,
    },
    stock:{
        type:Number,
        default:0,
    },
    price:{
        type:Number,
        default:0,
    },
    category:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Category',
        required:true
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User',
    }
}, {timestamps:true})

export const Category = mongoose.model('Product', productSchema)