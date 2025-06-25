import db from '../../DB/dbConnection.js';

export async function addCommentToPost(postId, userId, content, anonymous) {
    const [result] = await db.query(`
        INSERT INTO comments (post_id, user_id, content, anonymous)
        VALUES (?, ?, ?, ?)
    `, [postId, userId, content, anonymous]);
    return result.insertId;
}


export async function getCommentsForPost(postId) {
    const [rows] = await db.query(`
        SELECT c.*, u.user_name AS author_name
        FROM comments c
        JOIN users u ON c.user_id = u.id
        WHERE c.post_id = ?
        ORDER BY c.created_at
    `, [postId]);

    return rows;
}
// export async function deleteComment(commentId, userId) {
//     await db.query(`
//         DELETE FROM comments
//         WHERE id = ? AND user_id = ?
//     `, [commentId, userId]);
// }
export async function deleteComment(commentId, userId) {
    const [result] = await db.query(`
        DELETE FROM comments
        WHERE id = ? AND user_id = ?
    `, [commentId, userId]);

    // כדי למנוע שגיאה אם result לא קיים
    return result && result.affectedRows > 0;
}
