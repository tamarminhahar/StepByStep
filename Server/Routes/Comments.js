import express from 'express';
import * as CommentsController from '../Controllers/Comments.js'; 
import { authenticateJWT } from '../Middlewares/authenticateJWT.js';

const router = express.Router();

router.use(authenticateJWT);

router.get('/:postId/comments', CommentsController.getCommentsForPost);
router.post('/:postId/comments', CommentsController.addCommentToPost);
router.delete('/:commentId', CommentsController.deleteComment);

export default router;
