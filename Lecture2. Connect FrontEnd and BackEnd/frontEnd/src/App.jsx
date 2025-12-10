import { useState, useEffect } from 'react'
import './App.css'
import axios from 'axios'

function App() {
  const [jokes, setJokes] = useState([])

  useEffect(()=>{
    // axios.get('https://localhost:3000/jokes')
    axios.get('/api/jokes')   //generally upar walla format hii likhte hain par jab production mee jayege to wo problem karenga kyuki port hum specify nahii kar sakte, toh isiliye short aur necessary route hii likhenge.....aab hum dekhe to '/api' yee common hoga frontEnd and backEnd mee toh iske liye hum proxy laga denge(proxy implement karne kaa kaam 'vite.config.js' file mee hogaa) 
    .then((response)=>{
      setJokes(response.data)
    }).catch((error)=>{
      console.log(error)
    })
  })

  return (
    <>
    <h1>Chai and Full Stack</h1>
    <p>Jokes: {jokes.length}</p>
    {
      jokes.map((joke, index)=>(
        <div key={joke.id}>
          <h3>{joke.title}</h3>
          <p>{joke.content}</p>
        </div>
      ))
    }
    </>
  )
}

export default App
