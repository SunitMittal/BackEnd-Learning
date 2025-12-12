const mongoose = require("mongoose");

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
      trim:true
    },
    fullName: {
        type: String,
        required: true,
        trim:true
    },
    avatar: {           //actual img hum 3rd party(AWS or cloudinary) par store karenge aur wo jo URL denge wo yaha store karenge
      type: String,
      required:true
    },
    coverImage: {       //actual img hum 3rd party(AWS or cloudinary) par store karenge aur wo jo URL denge wo yaha store karenge
        type: String,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
    },
    refreshToken: {
      type: String,
    },
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);
