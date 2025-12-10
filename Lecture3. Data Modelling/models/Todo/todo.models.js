const mongoose = require('mongoose')

const todoSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true
    },
    complete: {
        type: Boolean,
        default: false      //by default iski value false hogi, par user agar value dega to ye modfify ho jayegi user kii value see
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,    //jaise string, number, etc ekk type hai waise hii ye bhi ek type hai(but special hai), jo ye bata hai kii reference model kii objectId store karni hai
        ref: "User"         //kiska ref(means reference) dee rahe hai, generally ref me hum uss model ka model_name likhte hai jisse hum iss model ko link/relate karwana chahte hai
    },
    subTodos: [
        {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'subTodo'
        }
    ],   //way to declare array(Syntax. fieldName:[]), yaha subTodos ekk array hai jisme hum subTodo model kii objectIds store karenge
}, { timestamps: true })

export const Todo = mongoose.model('Todo', todoSchema)