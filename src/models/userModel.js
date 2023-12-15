import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  name: {
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
  phone: {
    type: String,
    required: true,
    validate: {
      validator: function (value) {
        return /^[0-9]{10}$/.test(value);
      },
      message: 'Invalid phone number',
    },
  },

  address: {
    type: String,
  },
  profilePic: {
    type: String,
  },
  otp: {
    type: String,
  },
  status: {
    type: Number,
    default: 0,
  },
});

export default mongoose.model('User', userSchema);
