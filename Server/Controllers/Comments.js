import * as CommentsService from '../Services/Comments.js';


export async function getCommentsForPost(req, res) {
    const comments = await CommentsService.getCommentsForPost(req.params.postId);
    res.json(comments);
}

export async function addCommentToPost(req, res) {
    const { content, anonymous } = req.body;
    const commentId = await CommentsService.addCommentToPost(
        req.params.postId,
        req.user.id,
        content,
        anonymous
    );
    res.status(201).json({ id: commentId });
}


export async function deleteComment(req, res) {
    const commentId = req.params.commentId;
    const userId = req.user.id; 

    try {
        const deleted = await CommentsService.deleteComment(commentId, userId);

        if (!deleted) {
            return res.status(403).json({ message: 'אין הרשאה למחוק תגובה זו' });
        }

        res.json({ message: 'התגובה נמחקה בהצלחה' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'שגיאה במחיקת תגובה' });
    }
}
