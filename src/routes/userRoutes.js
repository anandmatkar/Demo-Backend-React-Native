import express from 'express';
import { uploadProfilePic, uploadMultipleFiles } from '../utils/uploadFile.js';
import { controller } from '../controllers/indexController.js';
import { jwt } from '../utils/jwt.js';

const router = express.Router();

router.post('/registerUser', controller.user.registerUser);
router.post('/registerUserForNative', controller.user.registerUserForNative);
router.post('/loginReactNative', controller.user.loginReactNativeUser);
router.post('/verifyOtpReactNative', controller.user.verifyReactNativeOtp);
router.post(
  '/uploadProfilePic',
  uploadProfilePic.single('image'),
  controller.user.uploadProfilePic
);

router.post('/verifyOTP', controller.user.verifyotp);
router.post('/loginUser', controller.user.loginUser);
router.put(
  '/updateUserInfo',
  jwt.verifyTokenAdmin,
  controller.user.updateUserInfo
);
router.post('/forgetPassUser', controller.user.forgetPassUser);
// router.post('/forgetOtpVerify', controller.user.forgetVerifyOTP);
router.put('/resetPassword', controller.user.resetPassword);
router.put(
  '/passwordChanges',
  jwt.verifyTokenAdmin,
  controller.user.changePassword
);
router.get(
  '/showUserProfile',
  jwt.verifyTokenAdmin,
  controller.user.showUserProfile
);

router.post(
  '/uploadFiles',
  uploadMultipleFiles.array('files'),
  controller.user.attactmentsFiles
);

//React-Native API

router.post('/registerUserForNative', controller.user.registerUserForNative);
router.post('/loginReactNative', controller.user.loginReactNativeUser);
router.post('/verifyOtpReactNative', controller.user.verifyReactNativeOtp);
router.get(
  '/showUserProfileReactNative',
  jwt.verifyTokenAdmin,
  controller.user.showUserProfileReactNative
);

export default router;
