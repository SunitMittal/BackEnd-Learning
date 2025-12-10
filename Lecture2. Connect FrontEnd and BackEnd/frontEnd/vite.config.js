import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  server:{
    proxy:{
      '/api':'http://localhost:3000'
    }
  },    //this server part is to add proxy

  plugins: [react()],
})

// proxy an important part of code used to connect frontEnd and backEnd
/*
Cors BackEnd kee liye hai aur Proxy FrontEnd kee liye
CORS(Cross-Origin Resource Sharing) -> It is a browser security rule that blocks a frontend from calling a backend if they run on different domains/ports. or we can say agar frontEnd & backEnd different port/origin par chal rahe hai, to browser unhe communicate nahii karne dega, par haa agar cors hoga toh communicate kar sakenge

Syntax:
  const cors = require("cors");
  app.use(cors(cors_option));

case1: agar kisi particular method & origin koo allow karna hai
    app.use(cors({
      origin: "origins (like. http://localhost:5173, etc)",
      methods: ["http_methods"],
      credentials: true
    }));

case2: agar sabhi method & origin koo allow karna hai
    app.use(cors());


Proxy-> is like a middle-man that forwards requests from React to the backend so the server doesn’t see them as cross-origin.
Syntax & eg. : like we do above in code
One more reason to use Proxy is without proxy, hume pura route/domain likhna padta hai like:"http://localhost:5000/api/users" par proxy use see hume pura route/domain nahi likhna padta like: "/api/users"

Eg. jaise hum apne ghar me only known person ko hii entry allow karte hai har kisi unknown koo nahi, similarly cors/proxy bhi yahii karte hai wo kewal unhi requests to allow karega jo particular(assigned) domains/ports aayi hai, sabko nahi
*/