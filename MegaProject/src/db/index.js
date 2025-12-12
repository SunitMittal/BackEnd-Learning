const mongoose = require("mongoose");

// DB bhi jab bhi communicate karo always try-catch & async-await use karna chahiye....kyuki ye possibilty hai kii while communication kuch error yaa problems aa jaye, to try-catch & async-await unn problems koo handle kar lenge

// DB ko connect karne kee humare pass 2 ways hai, kisi ko bhi use kar sakte hai koi difference nahii hai


// // way1 (using IIFE)
// (async () => {
//   try {
//     await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
//     console.log("DB Connected");
//   } catch (err) {
//     console.log("failed to connect DB ", err);
//     throw err;
//   }
// })();


// way2 (using normal way) (mostly we use this)
const connectDB = async () => {
  try {
    const connect = await mongoose.connect(`${process.env.MONGODB_URI}/${process.env.DB_NAME}`);
    console.log("DB Connected");
    console.log(`DB connected via ${connect.connection.host}`);   // connected db kaa host batayega
    console.log(`connected DB is ${connect.connection.name}`);   // connected db kaa name batayega
  } catch (err) {
    console.log("Failed to Connect to DB");
    console.log(err.message);
    process.exit(1);    //immediately stops the server when something went wrong....Exit code 0 means success(everything is fine) and 1 means failure(error occurs)
  }
};


// humare pass 2 ways hai code koo export karne kee, dono mee hi koi difference nahi hai kisi ko bhi use kar sakte hai, but haa 1 chez dhyan rakhni hai jis bhi way ko pich karenge phir usi ko entire program me use karenge phir chahe wo controllers kee code ko export karna ho ya models ke code ko yaa routes ke code ko ya DB ke code ko
// export default connectDB;    //way1   (modulejs way)
module.exports = connectDB;     //way2  (commonjs way)