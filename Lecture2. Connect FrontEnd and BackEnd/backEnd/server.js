// const express = require('express')  //normal way to import files/packages
// require('dotenv').config()

import express from 'express'       //another way to import files/packages this is called module way, but to use this in package.json we need to modify the type form ("type":"commonjs") to ("type":"module")
import dotenv from 'dotenv'
dotenv.config()

const app = express();

app.get('/api/jokes', (req, res)=>{
    const jokes = [
        {
            id:1,
            title: 'Joke1',
            content: 'This is a Joke'
        },
        {
            id:2,
            title: 'Joke2',
            content: 'This is another Joke'
        },
        {
            id:3,
            title: 'Joke3',
            content: 'This is another Joke'
        },
    ]
    res.send(jokes)
})

const port = process.env.PORT
app.listen(port, ()=>{
    console.log(`Server running on port ${port}`)
})