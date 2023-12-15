import User from '../models/userModel.js';
import Native from '../models/reactNativeModel.js';
import bcrypt from 'bcrypt';
import { welcomeMail, forgetPassMail } from '../utils/sendMail.js';
import { jwt } from '../utils/jwt.js';

export const registerUser = async (req, res) => {
  try {
    const { name, email, password, phone, address, profilePic } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.json({
        status: 400,
        success: false,
        error: 'Email is already in use',
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const otp = Math.floor(1000 + Math.random() * 9000);

    //create new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
      phone,
      address,
      profilePic,
      otp,
    });

    //Save the user to the database

    await newUser.save();
    welcomeMail(email, otp, name);

    res.json({
      status: 201,
      success: true,
      message: 'User registered Successfully',
      user: newUser,
    });
  } catch (error) {
    res.json({ status: 500, error: error.message });
  }
};

export const registerUserForNative = async (req, res) => {
  try {
    const { username, email, password, refferalID, transactionID } = req.body;
    const existingUser = await Native.find({ email });
    if (existingUser.length > 0) {
      console.log('existing user');
      return res.json({
        status: 400,
        success: false,
        error: 'Username is already in use',
      });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const otp = Math.floor(1000 + Math.random() * 9000);

    //create new user
    const newUser = new Native({
      username,
      email,
      password: hashedPassword,
      refferalID,
      transactionID,
      otp,
    });

    //Save the user to the database

    await newUser.save();
    welcomeMail(email, username, otp);

    res.json({
      status: 201,
      success: true,
      message: 'User registered Successfully',
    });
  } catch (error) {
    res.json({ status: 500, error: error.message });
  }
};

export const uploadProfilePic = async (req, res) => {
  try {
    let file = req.file;
    let path = `${process.env.PROFILE_PIC}/${file.filename}`;
    res.json({
      status: 201,
      success: true,
      message: 'Profile Uploaded successfully!',
      data: path,
    });
  } catch (error) {
    res.json({
      status: 400,
      success: false,
      message: error.message,
      data: '',
    });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.json({ status: 401, message: 'Credentials not matched' });
    }

    // Check if the user's status is 'verified'
    if (user.status === 1) {
      // Compare the entered password with the hashed password stored in the user document
      const isPasswordMatch = await bcrypt.compare(password, user.password);

      if (isPasswordMatch) {
        // Passwords match, generate a token
        const token = await jwt.issueJWT(user);

        return res.json({
          status: 200,
          success: true,
          message: 'Login successful',
          token: token,
        });
      } else {
        return res.json({
          status: 401,
          success: false,
          message: 'Password is incorrect',
        });
      }
    } else {
      return res.json({
        status: 401,
        success: false,
        message: 'User is not verified',
      });
    }
  } catch (error) {
    res.json({ status: 500, success: false, message: error.message });
  }
};

export const loginReactNativeUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Use logical OR to find user by username or email
    const user = await Native.findOne({ $or: [{ username }, { email }] });

    console.log(user, 'user');
    if (!user) {
      return res.json({ status: 401, message: 'Credentials not matched' });
    }
    if (user.status === 1) {
      // Compare the entered password with the hashed password stored in the user document
      const isPasswordMatch = await bcrypt.compare(password, user.password);

      if (isPasswordMatch) {
        // Passwords match, generate a tokenn
        const token = await jwt.issueJWT(user);

        return res.json({
          status: 200,
          success: true,
          message: 'Login successful',
          token: token,
        });
      } else {
        return res.json({
          status: 401,
          success: false,
          message: 'Password is incorrect',
        });
      }
    } else {
      return res.json({
        status: 401,
        success: false,
        message: 'User is not verified',
      });
    }
  } catch (error) {
    res.json({ status: 500, success: false, message: error.message });
  }
};

export const verifyotp = async (req, res) => {
  try {
    const { email, enteredOTP } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.json({
        status: 404,
        success: false,
        message: 'Email not found',
      });
    }

    // Check if the entered OTP matches the one saved in the user document
    if (user.otp === enteredOTP) {
      user.status = 1;
      await user.save();
      return res.json({
        status: 200,
        success: true,
        message: ' User verified Please login',
      });
    } else {
      return res.json({
        status: 401,
        success: false,
        message: 'Incorrect OTP',
      });
    }
  } catch (error) {
    res.json({ status: 500, success: false, message: error.message });
  }
};

export const verifyReactNativeOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    // Find the user by email
    const user = await Native.findOne({ email });

    if (!user) {
      return res.json({
        status: 404,
        success: false,
        message: 'Email not found',
      });
    }

    // Check if the entered OTP matches the one saved in the user document
    if (user.otp === otp) {
      user.status = 1;
      await user.save();
      return res.json({
        status: 200,
        success: true,
        message: ' User verified Please login',
      });
    } else {
      return res.json({
        status: 401,
        success: false,
        message: 'Incorrect OTP',
      });
    }
  } catch (error) {
    res.json({ status: 500, success: false, message: error.message });
  }
};

export const updateUserInfo = async (req, res) => {
  try {
    const { name, phone, address, profilePic } = req.body;
    const { id, email } = req.user;

    const user = await User.findById(id);

    if (!user) {
      return res.json({
        status: 404,
        success: false,
        message: 'User not found',
      });
    }

    user.name = name;
    user.phone = phone;
    user.address = address;
    user.profilePic = profilePic;

    await user.save();

    res.json({
      status: 200,
      success: true,
      message: 'User information updated',
      user,
    });
  } catch (error) {
    res.json({ status: 500, success: false, message: error.message });
  }
};

export const forgetPassUser = async (req, res) => {
  try {
    const { email } = req.body; // You only need the email from the request body

    // Find the user by email
    const user = await User.findOne({ email });

    if (user) {
      // Generate a random OTP (e.g., a 6-digit number)
      const otp = Math.floor(100000 + Math.random() * 900000);

      // Update the user's OTP in the database
      user.otp = otp;
      await user.save();

      // Send the OTP via email
      await forgetPassMail(email, otp, user.name);

      return res.json({
        status: 200,
        success: true,
        message: 'OTP sent to your email',
      });
    } else {
      return res.json({
        status: 404,
        success: false,
        message: 'User not found',
      });
    }
  } catch (error) {
    console.error(error);
    return res.json({
      status: 500,
      success: false,
      message: 'Internal server error',
    });
  }
};

// export const forgetVerifyOTP = async (req, res) => {
//   try {
//     const { email, otp } = req.body;

//     // Find the user by email
//     const user = await User.findOne({ email });

//     if (!user) {
//       return res.json({
//         status: 404,
//         success: false,
//         message: 'User not found',
//       });
//     }

//     if (user.otp === otp) {
//       return res.json({
//         status: 200,
//         success: true,
//         message: 'OTP verified Successfully',
//       });
//     } else {
//       return res.json({ status: 401, success: false, message: 'Invalid OTP' });
//     }
//   } catch (error) {
//     console.error(error);
//     return res.json({
//       status: 500,
//       success: false,
//       message: 'Internal server Error',
//     });
//   }
// };

export const resetPassword = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    // Find the user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res.json({
        status: 404,
        success: false,
        message: 'User not found',
      });
    }

    if (user.otp === otp) {
      // OTP is valid, reset the password
      const hashedPassword = await bcrypt.hash(newPassword, 12);
      user.password = hashedPassword;

      // Clear the OTP from the user's document
      // user.otp = undefined;
      await user.save();

      return res.json({
        status: 200,
        success: true,
        message: 'Password reset successfully',
      });
    } else {
      return res.json({
        status: 401,
        success: false,
        message: 'Invalid OTP',
      });
    }
  } catch (error) {
    console.error(error);
    return res.json({
      status: 500,
      success: false,
      message: 'Internal server error',
    });
  }
};

export const changePassword = async (req, res) => {
  try {
    const { email, password, newPassword } = req.body; // Change "currentPassword" to "password" here

    const user = await User.findOne({ email });

    if (!user) {
      return res.json({
        status: 404,
        success: false,
        message: 'User not found',
      });
    }
    if (await bcrypt.compare(password, user.password)) {
      // Change "currentPassword" to "password" here
      const hashedPassword = await bcrypt.hash(newPassword, 12);
      user.password = hashedPassword;
      await user.save();
      return res.json({
        status: 200,
        success: true,
        message: 'Password changed successfully',
      });
    } else {
      return res.json({
        status: 401,
        success: false,
        message: 'Incorrect current password',
      });
    }
  } catch (error) {
    return res.json({ status: 500, success: false, message: error.message });
  }
};

export const showUserProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select('-password');

    if (!user) {
      return res.json({
        status: 404,
        success: false,
        message: 'User not found',
      });
    }

    return res.json({
      status: 200,
      success: true,
      message: 'User profile retrieved successfully',
      data: user,
    });
  } catch (error) {
    return res.json({
      status: 500,
      success: false,
      message: error.message,
    });
  }
};

export const showUserProfileReactNative = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await Native.findById(userId).select('-password');

    if (!user) {
      return res.json({
        status: 404,
        success: false,
        message: 'User not found',
      });
    }

    return res.json({
      status: 200,
      success: true,
      message: 'User profile retrieved successfully',
      data: user,
    });
  } catch (error) {
    return res.json({
      status: 500,
      success: false,
      message: error.message,
    });
  }
};

export const attactmentsFiles = async (req, res) => {
  try {
    let files = req.files;
    let fileDetails = [];

    for (const file of files) {
      let path = `${process.env.Upload_Files}/${file.filename}`;
      let size = file.size;
      let mimetype = file.mimetype;
      fileDetails.push({ path, size, mimetype });
    }
    res.json({
      status: 201,
      success: true,
      message: 'Files Uploaded Successfully!',
      data: fileDetails,
    });
  } catch (error) {
    res.json({ status: 400, success: false, message: error.message });
  }
};
