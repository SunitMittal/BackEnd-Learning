const mongoose = require("mongoose");
const jwt = require("jsonwebtoken"); //'jsonwebtoken' library is used to generate a token which we can use to identify user
const bcrypt = require("bcrypt"); //'bcrypt' library is used to encrypt password

const userSchema = new mongoose.Schema(
  {
    watchHistory: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Video",
      },
    ],
    username: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true, //jab bhi ksis field mee searching enable karni hai toh uske index ko true mark karenge
      // index-> It creates a database index on the field, which allows MongoDB to perform faster queries for operation like: searching, etc
      // without index MongoDB checks every document for result but with index MongoDB jumps directly to matching documents.
      // but indexing consumes more memory and make DB slow, so it is better to use index for only those fields where searching happens more frequently or is necessary
      // hum searching bina index ko use kiye bhi kar sakte hai aur wo less memory consuming hoga but highly time consuming hoga
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    avatar: {
      //actual img hum 3rd party(AWS or cloudinary) par store karenge aur wo jo URL denge wo yaha store karenge
      type: String,
      required: true,
    },
    coverImage: {
      //actual img hum 3rd party(AWS or cloudinary) par store karenge aur wo jo URL denge wo yaha store karenge
      type: String,
    },
    password: {
      type: String,
      required: [true, "Password is required"],
    },
    refreshToken: {
      type: String,
    },
  },
  { timestamps: true }
);

// .pre() -> middleware fxn which is implemented just before data gets stored in mongoDB (or we can say it is a hook).    syntax: schemaName.pre('eventType, fxn_handler)
// eventTypes in mongoose: validate, save, updateOne, deleteOne
userSchema.pre("save", function (next) {
  // Only hash password if it's modified
  if (!this.isModified("password")) {
    if (typeof next === "function") {
      return next();
    }
    return;
  }

  // Hash the password using callback
  bcrypt.hash(this.password, 10, (err, hash) => {
    if (err) {
      if (typeof next === "function") {
        return next(err);
      }
      throw err;
    }
    this.password = hash;
    if (typeof next === "function") {
      next();
    }
  });
});
// fxn_handler arrow fxn nahii ho sakta, usse normal fxn mee hi likhna hoga, kyuki jaise humne js me padha tha kii arrow fxn me 'this' keyword ko access nahi kar sakte, aur yaha hume 'this' keword kii need hai, kyuki passowrd/kisi bhi field par bhi operation perform karke kee liye uska reference lena padega
//'bcrypt.hash(text, salt_rounds)' --> method to hash password, it will hash the text, and will hash assigned number of salt_rounds (we generally use 10 as salt_rounds, beacuse after 10 rounds we can say password is hashed very securely)

// 'pre' hook ko use toh karliya but ek problem hai kyuki pre hamesha modification ke phele implement hota hai, incase user nee password change hi nahi kiya, koi aur field change kari toh, 'pre' toh implement hoo chuka hoga, aur asie bohot baar hoga jab user data modify kar raha hai(not password), to aise me har baar password ki hashing bhi modify hogi, isse DB par load padega, toh isko resolve karne ke liye hum 'this.isModified(text)' ko use karenge, ye check karega kii kya actual me password modify hua hai ya nahii, aagar ha toh hashing modify hogi aur phir next() execute hoga aur aggar modify nahii hua hai toh kewal next() execute hoga

userSchema.methods.isPasswordCorrect = async function (password) {
  const check = await bcrypt.compare(password, this.password);
  return check;
};
//'.compare(text, hashed_text)' --> bcrypt method to compare text and hashed_text, if both matches it returns true, else returns false (only bcrypt library knows how he encrypts and decrypts text, we need not to worry)

userSchema.methods.generateAccessToken = function () {
  const jwtSecretKey = process.env.ACCESS_TOKEN_SECRET;

  const accessToken = jwt.sign(
    {   //jwt_variable_name: {data}
      user: {
        _id: this._id,
        email: this.email,
        username: this.username,
        fullName: this.fullName,
      },
    },  //PayLoad for JWT
    jwtSecretKey, //Signature for JWT
    { expiresIn: "15min" } // option for JWT expiration, having 'expiresIn' is necessary, to make sure that after this time the token must be deleted automatically
  );
  return accessToken;
};
//'.sign({payLoad}, signature, {options})' --> jwt method to create token, hum payLoad and signature provide karte hai aur jwt uske basis par ekk jwt token generate karke humme deta hai, hum saath hi kuch additional options bhi provide hai(like: expiresIn), jinke through hum token ko huch haad tak control kar sakte hai)

userSchema.methods.generateRefreshToken = function () {
  const tokenSecretKey = process.env.REFRESH_TOKEN_SECRET;

  const refreshToken = jwt.sign(
    {
      user: { _id: this._id },
    },
    tokenSecretKey,
    { expiresIn: "10d" }
  );
  return refreshToken;
};

const User = mongoose.model("User", userSchema);

module.exports = User;

// ye bcrypt, jwt, authentication, authorization, etc ka code hum models mee bhi likh sakte hai aur controller mee bhi, but controllers mee hi likhe toh better rahega

// bcrypt & bcryptjs both libraries are used to hash passwords securely using the bcrypt algorithm. both solve the same problem, but differ in how they’re implemented
// bcrypt vs bcryptjs

// jwt(Json Web Token) --> a stateless authentication token used to securely transmit user info between client and server
// jwt mee 3 components/parts hote hai:
//     1. Header: isme algorithm name, type and usse related data hota hai, issi algorithm kii help see data encrypt hotaa hai
//     2. Payload (simply means data): isme humara diya hua data hota hai (like: username, email, password, etc), ye data Header mee defined algorithm kee through encrypted hota hai
//     3. Verify-Signature: isme signature/key kee related information hotii hai (like: signature_value, etc), issi information kii help see Header mee defined algorithm kee through jo humara Payload walla data encrypt hua tha wo decrypt hotaa hai (or we can say issme Header me defined algorithm kii decrypting key hotii hai)

//     Eg. jwt token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0.KMUFsIDTnFmyG3nMiGM6H9FNFUROf3wh7SmqJp-QV30

//     Header Part: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9
//     PayLoad Part: eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0
//     Signature Part: KMUFsIDTnFmyG3nMiGM6H9FNFUROf3wh7SmqJp-QV30

// both access token and referesh token are part of jwt
// Access Token -> A short-lived(generally for 5–15 min) credential used to access protected resources, its purpose is to prove whether the user is authenticated or not, and it also carries authorization info (like: roles, permissions, etc)
// Refresh Token -> A long-lived(generally for days/weeks) credential used only to get new access tokens, its purpose is to keep user logged in without re-entering credentials

// matlab let say jab user nee login/signup kiya toh hum uske liye ek access-token(duration:10min) aur ek referesh-token(duration:1day) generate karenge, aab let say access-token expire ho gaya, toh aab user ko to wapas password dalne ko nahii bol sakte, toh aab yaha referesh token kaam aayega, hum check karenge ki referesh-token jo user ke pass hai aur humare DB me store hai, kya same hai, aagar yes toh user ko hum ek new access-token generate karke denge, but aagar same nahii hua toh user ko password re-enter karne bolnege

// How They Work Together (Flow)
// 1️. User logs in
// 2️. Server issues:
// Access token (15 min)
// Refresh token (7–30 days)
// 3️. Client uses access token for API calls or to redirect to secured routes
// 4️. if Access token expires, Client uses refresh token to get a new access token
// 5. User stays logged in seamlessly

// we generally store Access token in memory (JS variable) and Refresh token in secure cookies
// we should avoid storing either of them in localStorage ans sending refresh token with every request
