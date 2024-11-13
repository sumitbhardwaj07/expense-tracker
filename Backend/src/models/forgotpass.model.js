import mongoose from 'mongoose';

const forgotPasswordSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', 
    required: true,
  },
  resetToken: {
    type: String,
    required: true,
  },
  expires: {
    type: Date,
    required: true,
  },
}, {
  timestamps: true,
});

export const ForgotPassword = mongoose.model('ForgotPassword', forgotPasswordSchema);
