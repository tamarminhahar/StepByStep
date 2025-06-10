import express from 'express';
import { authenticateJWT } from '../Middlewares/auth.js';

// import authenticateJWT from '../Middlewares/authenticateJWT.js'; // Adjust the path as necessary
import * as PostController from '../Controllers/Posts.js'; // Capital P

const router = express.Router();

// Use authenticateJWT for all /posts routes
 router.use(authenticateJWT);

// Post routes
router.get('/', PostController.getPosts);
router.post('/', PostController.createPost);
// router.get('/:postId', PostController.getPostById);
router.delete('/:postId', PostController.deletePost);



// Nested routes - Likes
router.post('/:postId/likes', PostController.addLikeToPost);
router.delete('/:postId/likes', PostController.removeLikeFromPost);

// Nested routes - Follows
router.post('/:postId/follows', PostController.addFollowToPost);
router.delete('/:postId/follows', PostController.removeFollowFromPost);

export default router;
