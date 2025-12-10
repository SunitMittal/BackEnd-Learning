// to use mongoose, install mongoose package by running command 'npm i mongoose'

// step-1:
const mongoose = require('mongoose')        //import mongoose package

// step-2:
// const userSchema = new mongoose.Schema({})         //to create Schema (Schema is a method which takes object)

// step-3:
export const User = mongoose.model('User', userSchema)  //to create model in DB (model is a method that creates a model in DB, it takes 2 parameter model_name and model_schema)

// hum upar walli line ko aise bhi likh sakte hai, but yee standard practise nahii hai, standard practise upar walli hi hai
// const User = mongoose.model('User', userSchema)  //to create model in DB (model is a method that creates a model in DB, it takes 2 parameter model_name and model_schema)
// export default User

// code mee model_name camelcases mee denge wo coding kii standard practise hai, but ye model_name mongoDB me small cases and plural mee dikhega, wo MongoDB kii standard practise hai. jaise yaha hume model name 'User' diya hai but mongoDB mee wo 'users' display hoga


// Now let's explore step-2
// const userSchema = new mongoose.Schema({
//     username:String,
//     email:String,
//     isActive:Boolean,
//     age:Number,
// })      //by this we can define fields of schema, jaise yaha humne bataya kii humre schema mee 1 field hoga username kaa jisme string type values store hogii, aur similarly email, isActive and age kaa hai

// upar walla tarika aacha hai but kewal tab jab hume koi extra validations/conditions nahii lagani, par agar in depth likhna hai toh niche walla method use karenge

const userSchema = new mongoose.Schema({
    username: {
        type: String,           //dataType of username
        required: true,         //ensuring that the username is mandatory to fill
        unique: true,           //username should be unique
        // max: 20,                //maximum length of username can be 20
        max: [20, 'length should be less than 20'],       //agar hume msgs bhi add karne hai toh hum array banakar add kar sakte hai, aab in case user ne username 20 character se jyada ka dala toh usee msg display hoga ki 'length should be less than 20'
        lowercase: true         //username lowercase me hii store hoga, no matter user nee kaise data hai
        // ye validations/condition use karne kii power hume mongoose de raha hai
        // ye kewal kuch validations hai, mongoose ki documentation me jakar hum aur bhi explore kar sakte hai
    },
    // jaise hume age kee liye itne conditions lagaye waise hii baakio ke liye bhi laga sakte ahi
    email: {
        type: String,
    },
    isActive: {
        type: Boolean,
    },
    age: {
        type: Number,
    },
},
    {timestamps: true}      //timestamp is a special feature of mongoose, when we add this mongoose automatically adds 2 more field one is createdAt(date&time at which this dataEntry is created) and other is updatedAt(date&time at which this dataEntry is recently updated)
)