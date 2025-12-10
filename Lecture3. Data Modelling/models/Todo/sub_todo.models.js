const mongoose = require('mongoose')

const subTodoSchema = new mongoose.Schema({
    content:{
        type:String,
        required:true,
    },
    complete:{
        type:Boolean,
        required:false
    },
    createdBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
}, {timestamps:true})

export const subTodo = mongoose.model('subTodo', subTodoSchema)