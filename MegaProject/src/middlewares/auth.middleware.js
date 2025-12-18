const User = require("../models/user.model");
const jwt = require("jsonwebtoken");
// middleware ke case mee ek punchline yaad rakh sakte hai --'jaane se pehle mujhse milke janaa'-- punchline aachi hai kyuki let say jab hum kisi secured route par jayenge tabh bhi middleware ko pass karke jaana hoga(client-server, route-route kee beech me middleware hoga) aur jab bhi hum logOut karenge/ya kisi aise route par honge jaha hume user ke data ki need hai, par user se mang nahi sakte tabh bhi hume middleware ko pass karke jaana hoga(kyuki aagar use loggedIn hai ya active session me hai tabh kyuki wo use route tak middleware ko pass karke pahucha tha, toh middleware kee pass uski information present hoga).

exports.verifyJWT = async (req, res, next) => {
  try {
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ", "");
    // hume pata hai kii request object mee cookies present hogi(kyuki controller mee humne response mee pass karii thi) agar present hai wo value token me store hogi aur agar present nahi hai(in case access token expire ho gaya ho) request object kee header ki value ko token me store karlo
    // header me data key-value pair me present hota hai, aur jwt-tokens/encripted-data always 'Authorization' named key me present hota hai, aur wo present kaise hota hai 'Syntax -> Authorization: Bearer <token>', aur hume yaha need hai kewal <token> ki toh hum usse either .replace('Bearer ', '') karke extract kar lenge ya phir array ke ways se but uske liye hume pehle req.header('Authorization') ko ek variable me store karna hoga let say auth aur phir auth.split(" ")[1]

    if (!token) {
      return res.status(401).json({ msg: "Unauthorized Request" });
    }

    const jwtSecretKey = process.env.ACCESS_TOKEN_SECRET;
    const decodedToken = jwt.verify(token, jwtSecretKey);
    const findUserId = decodedToken._id;

    const userData = await User.findById(findUserId).select(
      "-password -refreshToken"
    );

    if (!userData) {
      return res.status(401).json({ msg: "Unauthorized" });
    }

    req.user = userData;    //request object me hum userData koo 'user' named variable me store kar rahe hai
    next();     //next() ka kaam kewal yeh hai ki agar sab sahi hai toh request ko aage forward karna
  } catch (err) {
    return res.status(401).json({ error: err.message, msg: "Invalid Access Token" });
  }
};
