import express from 'express';
import userRouters from './userRoutes.js';
import postRouters from './postRoutes.js';
const router = express.Router();

router.use('/user', userRouters);
router.use('/post', postRouters);

export default router;
