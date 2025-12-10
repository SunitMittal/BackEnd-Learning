const express = require('express')

require('dotenv').config()

const app = express()

app.get('/', (req, res)=>{
    res.send('Hello World')
})

app.get('/twitter', (req, res)=>{
    res.send('<h1>BackEnd dot com</h1>')
})

const objectData = {
    'name':'Sending Data',
    'id': 1234,
    'SendingData': false,
}

app.get('/object', (req, res)=>{
    res.json(objectData)
})

app.get('/value', (req, res)=>{
    res.send(123456)
})

const port = process.env.PORT
app.listen(port, ()=>{
    console.log(`Server Running on Port ${port}`)
})