const User = require("../models/user.model");
const uploadOnCloudinary = require("../utils/cloudinary");
const path = require("path");

exports.registerUser = async (req, res) => {
  // Step1: get user details from frontend
  const { username, email, fullName, password } = req.body; //form or json se jo bhi data aata hai wo hum 'req.body' see access kar sakte hai
  try {
    // Step2: validations
    if (!username) {
      res.status(400).json({ msg: "username is mandatory" });
    }

    if (!email) {
      res.status(400).json({ msg: "email is mandatory" });
    }

    if (!fullName) {
      res.status(400).json({ msg: "fullName is mandatory" });
    }

    if (!password) {
      res.status(400).json({ msg: "password is mandatory" });
    }

    // Step3: check if user already exists:(by both email & username)
    const checkUser = await User.findOne({
      //findOne mongoose method hai, jo DB first matching entry find karta hai
      $or: [{ username }, { email }], //$[{field_name1}, {field_name1}, ...] is a mongoose logical operator which check for whether field1 or field2 or.... present hai ya nahii
      // in simple way it's like (username === username) or (email === email)
    });

    if (checkUser) {
      res.status(401).json({ msg: "User Already exist" });
    }

    // Step4: check for images & avatar
    const avatarLocalPath = req.files?.avatar?.[0]?.path;
    // const coverImgLocalPath = req.files?.coverImage?.[0]?.path;

    // below method is much better than chaining everything, as using if block we can check conditions as well, like 'req.files' present hai aagar hai to kya usme coverImage kaa array present hai 'Array.isArray(req.files.coverImage)' aagar present hai toh kya uski length more than 0 hai 'req.files.coverImage.length > 0' aur aagr ye sabhi present hai toh finally hum make sure kar sakte hai ki coverImageLocalpath mee uss coverImage kaa path add kardoo.....isi tarah avatarLocalPath bhi likhna chahiye
    let coverImageLocalpath;
    if (
      req.files &&
      Array.isArray(req.files.coverImage) &&
      req.files.coverImage.length > 0
    ) {
      coverImageLocalpath = req.files.coverImage[0].path;
    }

    if (!avatarLocalPath) {
      res.status(401).json({ msg: "Avatar is required" });
    }

    // // Convert relative path to absolute path for Cloudinary (if required, else skip this)
    // const avatarPath = path.resolve(avatarLocalPath);
    // const coverImagePath = coverImageLocalpath
    //   ? path.resolve(coverImageLocalpath)
    //   : null;

    // Step5: upload them to cloudinary
    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = coverImageLocalpath
      ? await uploadOnCloudinary(coverImageLocalpath)
      : null;

    if (!avatar) {
      res.status(500).json({ msg: "Avatar upload failed" });
    }

    // Step6: create user object & create entry in DB
    const newUser = await User.create({
      username,
      avatar: avatar.url,
      coverImage: coverImage?.url || "",
      email,
      fullName,
      password,
    });

    // Step7: remove password & refresh token from response and return it
    const createdUser = await User.findById(newUser._id).select(
      "-password -refreshToken"
    );
    // .select('') -> controls which fields of DB document are returned by a query, to include just write field's name, and to exclude add '-' sign in front of field's name
    // to include: .select('field1_name field2_name')
    // to exclude: .select('-field3_name -field4_name')
    // we cannot mix inclusion and exclusion together means .select('field1_name -field2_name') is not allowed...(exception allowed only when field is _id(monogDB ID))
    // or instead of this we can add parameter 'select:false' in model(like we do 'required:true'), in the desired fields, so that these fields become sensitive by default

    if (!createdUser) {
      return res
        .status(400)
        .json({ msg: "Something went wrong while registering the user" });
    }

    return res.status(201).json({
      data: createdUser,
      message: "User registered Successfully",
    });
  } catch (err) {
    console.error("Error in registerUser:", err);
    return res
      .status(500)
      .json({ msg: "failed to create User", error: err.message });
  }
};

exports.loginUser = async (req, res) => {
  // Step1: get user details from frontend (user can login via email/username and password)
  const { email, password } = req.body;

  try {
    // Step2: validations
    if (!email) {
      res.status(400).json({ msg: "email is mandatory" });
    }

    if (!password || password == "") {
      res.status(401).json({ msg: "password is mandatory" });
    }

    // Step3: check if user already exists
    const checkUser = await User.findOne({ email });
    // const checkUser = await User.findOne({
    //   $or: [{ username }, { email }]
    // });  //if need we can check for both username & email

    if (!checkUser) {
      res.status(401).json({ msg: "User does not exist" });
    }

    // Step4: If user exist check password
    const checkPassword = await checkUser.isPasswordCorrect(password); //ye isPasswordCorrect() fxn humne models me likha hai

    if (!checkPassword) {
      res.status(401).json({ msg: "Incorrect Password" });
    }

    // Step5: if user verified, then generate access & refresh tokens
    const accessToken = await generateAccessToken();
    const refreshToken = await generateRefreshToken();
    // we created these generateAccessToken() & generateRefreshToken() fxns in models

    checkUser.refreshToken = refreshToken; //jo humne refershToken generate kiya hai usse DB mee bhi toh store karna hai
    await checkUser.save({ validateBeforeSave: false }); //.save() -> mongoose method to save data in DB
    // validateBeforeSave -> controls whether schema validation runs automatically when .save() called on a document
    // validateBeforeSave yaha necessary hai kyuki hum nahi chahte ki model kee validations re-run ho and specially password re-encrypt ho(kyuki humne model me .pre() method bhi lagaya hai)

    const loggedInUser = await User.findById(checkUser._id).select(
      "-password -refreshToken"
    );

    // Step6: send these tokens via secured cookies
    const options = {
      httpOnly: true,
      secure: true,
    }; //by default cookies browser/frontend se modifiable hoti ahi but agar hum httpOnly & secure ko true kar dete hai, toh aab cookies kewal server hi modify kar sakta hai aur koi nahii
    // syntax for cookies: .cookie(variable, value, options)

    return (
      res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        // .json({ user: loggedInUser, message: "User loggedIn Successfully" });
        .json({
          user: loggedInUser,
          accessToken,
          refreshToken,
          message: "User loggedIn Successfully",
        })
    ); //just to check, otherwise we already set tokens in cookies, so no need to send seperately
  } catch (err) {
    console.error("Error in loginUser:", err);
    return res
      .status(500)
      .json({ msg: "failed to logIn User", error: err.message });
  }
};

exports.logoutUser = async (req, res) => {
  // jab logut karna hai toh hume user kii mongoDb walli Id chahiye but , wo kaise ayegi, user se hum mang nahii sakte, DB se bina kisi reference(like email, username) ke access nahi kar sakte
  // yaha hum directly middleware se userId lenge, kyuki middleware par toh user a data present hai hi(only when user already loggedIn hai)
  try {
    // Step1: get user details from middleware
    const userId = req.user._id;

    // Step2: clear/delete the refresh token from DB
    await User.findByIdAndUpdate(
      userId,
      { $set: { refreshToken: undefined } },
      // $unset: { refreshToken: 1 }  // better than setting value as undefined (1 is just a constant, mongoDB ignores it anyway)
      { new: true }
    );
    // new:true -> ise aab result me new/updated DB values milegi, agar ye nahi hoga toh hume result me old DB values hi milegi

    // Step3: send updated/clear token values via cookies
    const options = {
      httpOnly: true,
      secure: true,
    };

    return res.status(200)
      .clearCookie("accessToken", options)
      .clearCookie("refreshToken", options)
      .json({ message: "User loggedOut Successfully" });
    // .clearCookie() --> clear the values from cookies
  } catch (err) {
    console.error("Logout error:", err);
    return res.status(500).json({ msg: "Logout failed" });
  }
};
