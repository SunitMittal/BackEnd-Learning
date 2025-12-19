const express = require("express");
const router = express.Router();
const upload = require("../middlewares/multer.middleware");

const { registerUser, loginUser, logoutUser, refreshAccessToken } = require("../controllers/user.controller");
const {verifyJWT} = require("../middlewares/auth.middleware");

router.post("/register",upload.fields([
    { name: "avatar", maxCount: 1 },
    { name: "coverImage", maxCount: 1 },
  ]),
  registerUser
);
//.single() kewal 1 hi file leta, aur .array() ek hi storage me multiple files insert karta, par .fields() ka ye benefit hai ki iske through hum multiple files upload karwa sakte hai
//maxCount means ki avatar name kii field me max kitni files upload karni hai

router.post("/login", loginUser);
router.post("/logout", verifyJWT, logoutUser);
router.post("/refresh-token", refreshAccessToken);

module.exports = router;
