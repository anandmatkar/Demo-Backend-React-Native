import mongoose from 'mongoose';

const userReactNativeSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    validate: {
      validator: function (value) {
        return /\S+@\S+\.\S+/.test(value);
      },
      message: 'Invalid email address',
    },
  },
  password: {
    type: String,
    required: true,
    minLength: 6,
  },
  refferalID: {
    type: String,
    require: true,
  },
  transactionID: {
    type: String,
    require: true,
  },
  otp: {
    type: String,
  },
  status: {
    type: Number,
    default: 0,
  },
});

export default mongoose.model('UserReactNative', userReactNativeSchema);
