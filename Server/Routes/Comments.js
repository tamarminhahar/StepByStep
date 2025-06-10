import express from 'express';
// import authenticateJWT from '../Middlewares/authenticateJWT.js'; // Adjust the path as necessary
import * as CommentsController from '../Controllers/Comments.js'; 

const router = express.Router();

router.get('/:postId/comments', CommentsController.getCommentsForPost);
router.post('/:postId/comments', CommentsController.addCommentToPost);
export default router;
