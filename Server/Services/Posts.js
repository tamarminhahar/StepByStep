import db from '../../DB/dbConnection.js';

 export async function getPostsByUser(userId) {
     const [rows] = await db.query(`
         SELECT * FROM posts WHERE user_id = ? ORDER BY created_at DESC
     `, [userId]);
     return rows;
 }

export async function getAllPosts(options = {}) {
    const {
        sort = 'date',
        grief_tag,
        startDate,
        endDate,
        liked,
        userId,
    } = options;

    let query = `SELECT posts.*, 
                        COUNT(DISTINCT likes.id) AS likesCount,
                        COUNT(DISTINCT comments.id) AS commentsCount
                 FROM posts
                 LEFT JOIN likes ON likes.post_id = posts.id
                 LEFT JOIN comments ON comments.post_id = posts.id`;

    const params = [];
    const conditions = [];

    if (grief_tag) {
        conditions.push('posts.grief_tag = ?');
        params.push(grief_tag);
    }

    if (startDate) {
        conditions.push('posts.created_at >= ?');
        params.push(startDate);
    }

    if (endDate) {
        conditions.push('posts.created_at <= ?');
        params.push(endDate);
    }

    if (userId) {
        conditions.push('posts.user_id = ?');
        params.push(userId);
    }

    if (conditions.length) {
        query += ` WHERE ${conditions.join(' AND ')}`;
    }

    query += ' GROUP BY posts.id';

    if (liked) {
        query += ' HAVING likesCount > 0';
    }

    if (sort === 'popularity') {
        query += ' ORDER BY (likesCount + commentsCount) DESC';
    } else {
        query += ' ORDER BY posts.created_at DESC';
    }

    const [rows] = await db.query(query, params);
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


