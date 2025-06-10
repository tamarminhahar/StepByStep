import db from '../../DB/dbConnection.js';


export async function addCommentToPost(postId, userId, content) {
    const [result] = await db.query(`
        INSERT INTO comments (post_id, user_id, content)
        VALUES (?, ?, ?)
    `, [postId, userId, content]);
    return result.insertId;
}

export async function getCommentsForPost(postId) {
    const [rows] = await db.query(`
        SELECT * FROM comments WHERE post_id = ? ORDER BY created_at
    `, [postId]);
    return rows;
}
