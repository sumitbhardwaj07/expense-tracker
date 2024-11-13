import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from 'jsonwebtoken';
import { sendEmail } from "../utils/sendEmail.js";


//generate access and refresh tokens
const generateAccessAndRefereshTokens = async(userId) =>{
  try {
      //console.log(userId);
      const user = await User.findById(userId);
      if (!user) throw new ApiError(404, "User not found");
      //console.log(user);
      const accessToken = user.generateAccessToken()
      const refreshToken = user.generateRefreshToken()
      //console.log(accessToken);
      //console.log(refreshToken)

      user.refreshToken = refreshToken
      await user.save({ validateBeforeSave: false })

      return {accessToken, refreshToken}


  } catch (error) {
      throw new ApiError(500, "Something went wrong while generating referesh and access token")
  }
}

//generate otp

const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

//send otp 

const sendOtp = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    throw new ApiError(400, "Email is required");
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(409, "User with this email already exists");
  }

  const otp = generateOtp();

  const otpToken = jwt.sign(
    { email, otp },
    process.env.OTP_SECRET,
    { expiresIn: '10m' } 
  );

  const message = `Your OTP code is ${otp}. It is valid for 10 minutes.`;

  await sendEmail({
    email,
    subject: 'OTP for Registration',
    message,
  });

  res.status(200).json({ success: true, message: 'OTP sent successfully', otpToken });
});

// verify otp 

const verifyOtp = asyncHandler(async (req, res) => {
  const { otpToken, otp, email, password } = req.body;

  if (!otpToken || !otp || !email || !password) {
    throw new ApiError(400, "OTP, email, and password are required");
  }

  let decodedToken;
  try {
    decodedToken = jwt.verify(otpToken, process.env.OTP_SECRET);
  } catch (error) {
    throw new ApiError(400, "Invalid or expired OTP");
  }

  if (decodedToken.email !== email) {
    throw new ApiError(400, "Invalid email for this OTP");
  }

  if (decodedToken.otp !== otp) {
    throw new ApiError(400, "Incorrect OTP");
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(409, "User with this email already exists");
  }


  const user = await User.create({
    email,
    password,
  });

  const createdUser = await User.findById(user._id).select("-password -refreshToken");

  if (!createdUser) {
    throw new ApiError(500, "User registration failed");
  }

  res.status(201).json(new ApiResponse(200, createdUser, "User registered successfully"));
});


//login

const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email) {
    throw new ApiError(400, "Email is required");
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(404, "User does not exist");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ApiError(401, "Invalid credentials");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(user._id);

  const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

  const options = { httpOnly: true, secure: true };

  res.status(200)
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)
    .json(new ApiResponse(200, { user: loggedInUser, accessToken, refreshToken }, "User logged in successfully"));
});

//logout

const logoutUser = asyncHandler(async (req, res) => {
  await User.findByIdAndUpdate(req.user._id, { $unset: { refreshToken: 1 } }, { new: true });

  const options = { httpOnly: true, 
    secure: true,
   };

  res.status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out"));
});

//Refresh token 

const refreshAccessToken = asyncHandler(async (req, res) => {
  const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new ApiError(401, "Unauthorized request");
  }

  try {
    const decodedToken = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET);
    const user = await User.findById(decodedToken?._id);

    if (!user || incomingRefreshToken !== user?.refreshToken) {
      throw new ApiError(401, "Invalid or expired refresh token");
    }

    const { accessToken, newRefreshToken } = await generateAccessAndRefereshTokens(user._id);

    const options = { httpOnly: true, secure: true };

    res.status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(new ApiResponse(200, { accessToken, refreshToken: newRefreshToken }, "Access token refreshed"));
  } catch (error) {
    throw new ApiError(401, "Invalid refresh token");
  }
});

//change password

const changeCurrentPassword = asyncHandler(async (req, res) => {
  const { newpassword, currentpassword } = req.body;


  if (!newpassword || !currentpassword) {
    throw new ApiError(400, "Both current and new passwords are required.");
  }
  const user = await User.findById(req.user?._id);
  const isPasswordCorrect = await user.isPasswordCorrect(currentpassword);

  if (!isPasswordCorrect) {
    throw new ApiError(400, "Invalid old password");
  }

  user.password = newpassword;
  await user.save({ validateBeforeSave: false });

  res.status(200).json(new ApiResponse(200, {}, "Password changed successfully"));
});


const getCurrentUser = asyncHandler(async (req, res) => {
  res.status(200).json(new ApiResponse(200, req.user, "User fetched successfully"));
});

export {
  sendOtp,
  verifyOtp,
  loginUser,
  logoutUser,
  refreshAccessToken,
  changeCurrentPassword,
  getCurrentUser,
};