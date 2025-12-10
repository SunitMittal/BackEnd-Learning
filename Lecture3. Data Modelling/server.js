// always code likhne se phele ye understand karna jaruri hai kii data kya hoga, kesa hoga, kaha store hoga, etc. (isko imagine karne ya rough sketch kee liye moon Modeler, eraser.io, etc websites koo use kar sakte hai)

const express = require('express')
const app = express()

app.get('/', (req, res)=>{
    res.send('<h1>Server is Working</h1>')
})

app.listen(4000, ()=>{
    console.log(`Server running on ${port}`)
})

// Server ko database see connect karne kee liye hum ODMs(mongoose for MongoDB, sequilize for MySQL) use karte hai inhe helper bolte hai, inme kuch ese methods/fxns hote hai jo na sirf server-DB mee connection banate hai balki kuch aur features bhi provide karte hai jo workflow koo easy banata hai