import db from '../../DB/dbConnection.js';

 export async function getPostsByUser(userId) {
     const [rows] = await db.query(`
         SELECT * FROM posts WHERE user_id = ? ORDER BY created_at DESC
     `, [userId]);
     return rows;
 }

 export async function getAllPosts() {
    const [rows] = await db.query(`
        SELECT * FROM posts ORDER BY created_at DESC
    `);
    return rows;
}
export async function addPost(userId, title, body, media_url, grief_tag) {
    const [result] = await db.query(`
        INSERT INTO posts (user_id, title, body, media_url, grief_tag)
        VALUES (?, ?, ?, ?, ?)
    `, [userId, title, body, media_url, grief_tag]);
    return result.insertId;
}

// export async function getPostById(postId) {
//     const [rows] = await db.query(`
//         SELECT * FROM posts WHERE id = ?
//     `, [postId]);
//     return rows[0];
// }

export async function deletePost(postId, userId) {
    const [result] = await db.query(`
        DELETE FROM posts WHERE id = ? AND user_id = ?
    `, [postId, userId]);
    return result.affectedRows > 0;
}

export async function updatePost(postId, userId, title, body) {
    await db.query(`
        UPDATE posts SET title = ?, body = ? WHERE id = ? AND user_id = ?
    `, [title, body, postId, userId]);

    const [rows] = await db.query(`SELECT * FROM posts WHERE id = ?`, [postId]);
    return rows[0];
}


// Likes
export async function addLikeToPost(postId, userId) {
    await db.query(`
        INSERT IGNORE INTO likes (post_id, user_id)
        VALUES (?, ?)
    `, [postId, userId]);
}

export async function removeLikeFromPost(postId, userId) {
    await db.query(`
        DELETE FROM likes WHERE post_id = ? AND user_id = ?
    `, [postId, userId]);
}

// Follows
export async function addFollowToPost(postId, userId) {
    await db.query(`
        INSERT IGNORE INTO post_follows (post_id, user_id)
        VALUES (?, ?)
    `, [postId, userId]);
}

export async function removeFollowFromPost(postId, userId) {
    await db.query(`
        DELETE FROM post_follows WHERE post_id = ? AND user_id = ?
    `, [postId, userId]);
}


