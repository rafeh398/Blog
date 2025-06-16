import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { User } from "../models/user.model.js"
import jwt from "jsonwebtoken"
import validator from "validator"

//generate tokens
const generateAccessToken = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) throw new ApiError(404, "User not found");

    const token = {
      accessToken: jwt.sign(
        {
          _id: user._id,
          email: user.email,
          fullName: user.fullName
        },
        process.env.ACCESS_TOKEN_SECRET,
        {
          expiresIn: process.env.ACCESS_TOKEN_EXPIRY
        }
      ),

      
    }

    return token;
  } catch (error) {
    throw new ApiError(500, "Something went wrong while generating access and refresh tokens");
  }
};


//cookie options


const isProd = process.env.NODE_ENV === "production";

const cookieOptions = {
  httpOnly: true,
  secure: isProd,                // true only in production
  sameSite: isProd ? "None" : "Lax", // None required for cross-site
};


//register user

const registerUser = asyncHandler(async (req, res) => {
  //req data
  const { fullName, email, password } = req.body;


  //step 2 validate

  if (
    [fullName, email, password].some((field) => field?.trim() == "") //some zada field ko check krega and trim kbad b ager empty ha to error throw kro
  ) {
    throw new ApiError(400, "All fields are required")
  }
  //email
  if (!validator.isEmail(email)) {
    throw new ApiError(400, "Invalid email format");
  }
  //password
  if (
    !validator.isStrongPassword(password, {
      minLength: 8,
      minLowercase: 1,
      minUppercase: 1,
      minNumbers: 1,

    })
  ) {
    throw new ApiError(
      400,
      "Password must be at least 8 characters long and include uppercase, lowercase and number"
    );
  }
  //check if user already exists

  const existedUser = await User.findOne({ email })

  if (existedUser) {
    throw new ApiError(409, "User already exists")
  }

  //store user in db
  const user = await User.create({
    fullName,
    email,
    password,
  })

  //ager user bn gia to password remove kr do ku createdUser hmne response mein bejna to client k pas na jaye

  const createdUser = await User.findById(user._id).select("-password")
  
  //ager ni bna to error 
  if (!createdUser) {
    throw new ApiError(500, "Something went wrong while registering the user")
  }
   const { accessToken } = await generateAccessToken(user._id);

  //Set token in cookie
  


res
  .status(201)
  .cookie("accessToken", accessToken, cookieOptions)
  .json(new ApiResponse(201, { user: createdUser, accessToken }, "User registered successfully"));

});







//login user
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email) {
    throw new ApiError(400, "Email is required");
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new ApiError(400, "User does not exist");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid credentials");
  }

  const { accessToken } = await generateAccessToken(user._id);
  const loggedInUser = await User.findById(user._id).select("-password");

  res
    .status(200)
    .cookie("accessToken", accessToken, cookieOptions)
    .json(
      new ApiResponse(200, { user: loggedInUser, accessToken }, "User Logged in Successfully")
    );
});


//logout 

const logout = asyncHandler(async (req, res) => {


  const options = {
    httpOnly: true,
    secure: true
  }
  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("adminAccessToken",options)
    .json(new ApiResponse(200, {}, "logged out"))

})



//admin login

  const adminLogin = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    // Validate request
    if (!email || !password) {
      throw new ApiError(400, "Email and password are required");
    }

    // Check against environment variables
    if (
      email === process.env.ADMIN_EMAIL &&
      password === process.env.ADMIN_PASSWORD
    ) {
      const adminAccessToken = jwt.sign(
        { email },
        process.env.ADMIN_ACCESS_TOKEN_SECRET,
        { expiresIn: process.env.ADMIN_ACCESS_TOKEN_EXPIRY }
      );

     


      const options = {
        httpOnly: true,
        secure: true,
      }




      return res
        .status(200)
        .cookie("adminAccessToken", adminAccessToken, options)
        .json(
          new ApiResponse(200, null, "Admin Logged in Successfully ")
        )


    } else{
       throw new ApiError(401, "Invalid admin credentials"); 
    }
  });

//admin status
const adminStatus = asyncHandler(async (req, res) => {
  const token = req.cookies.adminAccessToken;
  if (!token) {
    throw new ApiError(401, "Not logged in");
  }

  try {
    const decoded = jwt.verify(token, process.env.ADMIN_ACCESS_TOKEN_SECRET);
    return res.status(200).json({ loggedIn: true, email: decoded.email });
  } catch (err) {
    throw new ApiError(401, "Invalid token");
  }
});

//user status
const userStatus = asyncHandler(async (req, res) => {
 

  
  const token = req.cookies.accessToken;
  console.log("Cookies:", req.cookies);
console.log("Token:", req.cookies.accessToken);


  if (!token) {
    throw new ApiError(401, "Not logged in");
  }

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findById(decoded._id).select("-password");

    if (!user) {
      throw new ApiError(401, "User not found");
    }

    return res.status(200).json({
      loggedIn: true,
      user,
    });
  } catch (err) {
    throw new ApiError(401, "Invalid or expired token");
  }
});







export { registerUser, loginUser, adminLogin, logout, adminStatus,userStatus}


