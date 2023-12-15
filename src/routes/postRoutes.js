import express from 'express';
import { postController } from '../controllers/indexController.js';
import { uploadPost } from '../utils/uploadFile.js';
import { jwt } from '../utils/jwt.js';

const router = express.Router();

router.post(
  '/createpost',
  jwt.verifyTokenAdmin,
  uploadPost.array('files'),
  postController.post.postCreate
);

router.put('/updatePost', jwt.verifyTokenAdmin, postController.post.updatePost);
router.delete(
  '/deletePost',
  jwt.verifyTokenAdmin,
  postController.post.deletePost
);
router.get(
  '/getAllPostDetails',
  jwt.verifyTokenAdmin,
  postController.post.getAllPost
);
router.get(
  '/getOnePostDetails',
  jwt.verifyTokenAdmin,
  postController.post.getSinglePost
);
export default router;
