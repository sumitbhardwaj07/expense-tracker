import jwt from 'jsonwebtoken';
import { User } from '../models/user.model.js';
import { sendEmail } from '../utils/sendEmail.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiError } from "../utils/ApiError.js";


const requestPasswordReset = asyncHandler(async (req, res) => {
  const { email } = req.body;
  
  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(404, 'User with this email does not exist');
  }

  const resetToken = jwt.sign({ id: user._id }, process.env.RESET_TOKEN_SECRET, { expiresIn: '15m' });

  const resetUrl = `${process.env.FRONTEND_URL}/resetpassword/${resetToken}`;


  await sendEmail({
    email,
    subject: 'Password Reset Request',
    message: `Reset your password using the following link: ${resetUrl}`,
  });

  res.status(200).json({ success: true, message: 'Password reset email sent.' });
});


const resetPassword = asyncHandler(async (req, res) => {
    const { token } = req.params;
    const { newPassword } = req.body;
  
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.RESET_TOKEN_SECRET);
    } catch (error) {
      throw new ApiError(400, 'Invalid or expired reset token');
    }
  
    const user = await User.findById(decoded.id);
    if (!user) {
      throw new ApiError(404, 'User not found');
    }
  
    user.password = newPassword; 
    await user.save({ validateBeforeSave: true });
  
    res.status(200).json({ success: true, message: 'Password has been reset successfully.' });
  });

  
  export { requestPasswordReset, resetPassword }
