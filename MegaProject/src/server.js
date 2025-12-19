require("dotenv").config(); //code jab bhi run hoga sabse phele .env file process hogii

const express = require("express");
const app = express();
// Express.js -> most popular & useful framework for Node having a lot of inbuilt libraries which helps in building servers, routing, middleware support and request parsing.
// in express we mainly works with 2 objects Request (req) and Response (res).
// 'req' is for data that client sends to our server.
// res -> is the response server sent back to the client
// Some common methods/properties:
// 1. req.body -> to access data sent in POST/PUT requests

// 2. req.params -> to access dynamic parameters of URL
// eg. let say the URL is '/user/123' now using 'req.params.id' we can fetch the id 123

// 3. req.query -> to access query string parameters of URL
// eg. let say the URL is '/user?page=2&sort=asc' now using 'req.query.page' we can fetch the page no. 2

// 4. req.headers -> to access HTTP headers sent by client
// eg. req.headers["authorization"] --- we will discuss about this method in middlewares

// 5. req.url -> to access Full URL of request.

// 6. res.send(data) -> to send text or JSON data
// eg. res.send("Hello World")

// 7. res.json(object) -> to send JSON object explicitly
// eg. res.json({ message: "Success" })

// 8. res.status(code) -> to set HTTP status code
// eg.res.status(404).json({ error: "Not found" });

// 9. res.cookie(data) -> to set a cookie
// eg. res.cookie("token", "xyz123")

// 10. res.redirect(route) -> to redirect the client to a specific route
// eg. res.redirect("/login")

const cors = require("cors");
const cookieParser = require("cookie-parser");

app.use(cors());

//express.json() -> a middleware that reads the incoming data, converts that JSON data into JS object and then attach it to req.body
// Eg. let say frontEnd sends the data as {"name": "Ali", "age": 22}, after using this middleware we can access the data by req.body.name and req.body.age

app.use(express.json({ limit: "16kb" }));
// limit -> this restricts the maximum size of JSON payloads our server accepts, so if someone tries to send large data(like big files or huge JSON), express will reject the request and alos protects our server from attacks & accidental large requests (Default limit is around 100kb)

// Some Inbuilt middlewares that we used mostly:
// 1. express.json() → for JSON
// 2. express.urlencoded() → for form data
// 3. multer → for files like imgs, videos, pdfs, etc
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser()); //thats how we implement this, ismee bhi options hote hai like limit, etc par unki nahi hii ya bohot rarely need padegi

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});

const connectDB = require("./db/index");
connectDB();

const userRouter = require('./routes/user.route')
app.use('/api/v1/users', userRouter)

// cookie-parser -> middleware jiska kaam kewal itna hai kii server see browser mee present cookies koo access kar paye aur set kar paye (basically cookies par CRUD operations karna)
// app.use() --> taab use karenge jab hume koi middleware ya configuration settings karni hai

// CORS(Cross-Origin Resource Sharing) -> It is a browser security rule that blocks a frontend from calling a backend if they run on different domains/ports. or we can say agar frontEnd & backEnd different port/origin par chal rahe hai, to browser unhe communicate nahii karne dega, par haa agar cors hoga toh communicate kar sakenge

// Syntax:
//   const cors = require("cors");
//   app.use(cors(cors_option));

// case1: agar kisi particular method & origin koo allow karna hai
//     app.use(cors({
//       origin: "origins (like. http://localhost:5173, etc)",
//       methods: ["http_methods"],
//       credentials: true
//     }));

// case2: agar sabhi method & origin koo allow karna hai
//     app.use(cors());

// Generally hum jo fxn_handler likhte hai usme 4 parameters hote hai err, req, res, next. (hum apne use kee according fxn_handler mee mention karte hai)
// err -> error show karne kee liye
// req -> request (express object)
// res -> response (express object)
// next -> middlewares ke flow ko continue rakhne ke liye
