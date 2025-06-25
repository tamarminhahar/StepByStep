import db from '../../DB/dbConnection.js';

export async function getPostsByUser(userId) {
    const [rows] = await db.query(`
         SELECT * FROM posts WHERE user_id = ? ORDER BY created_at DESC
     `, [userId]);
    return rows;
}

export async function getAllPosts(userId) {
    const [rows] = await db.query(`
        SELECT posts.*, 
               posts.user_id = ? AS can_edit,
               (SELECT user_name FROM users WHERE users.id = posts.user_id) AS author_name,
               (SELECT COUNT(*) FROM likes WHERE likes.post_id = posts.id) AS likes_count,
               EXISTS(SELECT 1 FROM likes WHERE likes.post_id = posts.id AND likes.user_id = ?) AS user_liked,
               (SELECT COUNT(*) FROM comments WHERE comments.post_id = posts.id) AS comments_count
        FROM posts
        ORDER BY created_at DESC
    `, [userId, userId]);

    return rows.map(row => ({
        ...row,
        can_edit: !!row.can_edit,
        user_liked: !!row.user_liked,
        likes_count: row.likes_count || 0,
        author_name: row.author_name

    }));
}

export async function addPost(userId, title, body, media_url, post_type) {
    const [result] = await db.query(`
        INSERT INTO posts (user_id, title, body, media_url, post_type)
        VALUES (?, ?, ?, ?, ?)
    `, [userId, title, body, media_url, post_type]);
    return result.insertId;
}


export async function deletePost(postId, userId) {
    const [result] = await db.query(`
        DELETE FROM posts WHERE id = ? AND user_id = ?
    `, [postId, userId]);
    return result.affectedRows > 0;
}

export async function updatePost({ id, user_id, title, body, post_type, media_url }) {
    await db.query(`
        UPDATE posts 
        SET title = ?, body = ?, post_type = ?, media_url = ?
        WHERE id = ? AND user_id = ?
    `, [title, body, post_type, media_url, id, user_id]);

    const [rows] = await db.query(`SELECT * FROM posts WHERE id = ?`, [id]);
    return rows[0];
}

export async function getPostById(postId) {
    const [rows] = await db.query(
        `SELECT * FROM posts WHERE id = ?`,
        [postId]
    );
    return rows[0];
}
export async function getPostByIdWithDetails(postId, userId) {
    const [rows] = await db.query(`
        SELECT posts.*,
               posts.user_id = ? AS can_edit,
               (SELECT user_name FROM users WHERE users.id = posts.user_id) AS author_name,
               (SELECT COUNT(*) FROM likes WHERE likes.post_id = posts.id) AS likes_count,
               EXISTS(SELECT 1 FROM likes WHERE likes.post_id = posts.id AND likes.user_id = ?) AS user_liked,
               (SELECT COUNT(*) FROM comments WHERE comments.post_id = posts.id) AS comments_count
        FROM posts
        WHERE posts.id = ?
    `, [userId, userId, postId]);

    if (rows.length === 0) return null;

    const row = rows[0];
    return {
        ...row,
        can_edit: !!row.can_edit,
        user_liked: !!row.user_liked,
        likes_count: row.likes_count || 0,
        author_name: row.author_name
    };
}
export async function getPostsPaginated(userId, page = 1, limit = 10) {
    const offset = (page - 1) * limit;

    const [rows] = await db.query(`
        SELECT posts.*, 
               posts.user_id = ? AS can_edit,
               (SELECT user_name FROM users WHERE users.id = posts.user_id) AS author_name,
               (SELECT COUNT(*) FROM likes WHERE likes.post_id = posts.id) AS likes_count,
               EXISTS(SELECT 1 FROM likes WHERE likes.post_id = posts.id AND likes.user_id = ?) AS user_liked,
               (SELECT COUNT(*) FROM comments WHERE comments.post_id = posts.id) AS comments_count
        FROM posts
        ORDER BY created_at DESC
        LIMIT ? OFFSET ?
    `, [userId, userId, limit, offset]);

    return rows.map(row => ({
        ...row,
        can_edit: !!row.can_edit,
        user_liked: !!row.user_liked,
        likes_count: row.likes_count || 0,
        author_name: row.author_name
    }));
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



