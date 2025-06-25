
// // export default SinglePost;
// import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { useCurrentUser } from '../hooks/useCurrentUser';
// import styles from './postStyle/SinglePost.module.css';
// import Comments from '../comments/Comments';
// import { toast } from 'react-toastify';
// import ApiClientRequests from '../../ApiClientRequests';

// const SinglePost = ({ post, fetchPosts }) => {
//     const { currentUser, loading } = useCurrentUser();
//     const [showComments, setShowComments] = useState(false);
//     const navigate = useNavigate();

//     if (loading || !currentUser) return null;

//     const handleDelete = async (id) => {
//         try {
//             await ApiClientRequests.deleteRequest(`posts/${id}`);
//             toast.success('הפוסט נמחק בהצלחה');
//             await fetchPosts(post.id); // רק קריאה – בלי גלילה ידנית
//         } catch (err) {
//             toast.error(err.message);
//             console.error(err);
//         }
//     };

//     const handleToggleLike = async (post) => {
//         try {
//             const method = post.user_liked ? 'DELETE' : 'POST';
//             await ApiClientRequests[method === 'POST' ? 'postRequest' : 'deleteRequest'](`posts/${post.id}/likes`);
//             await fetchPosts(post.id); // אותו דבר כאן
//         } catch (err) {
//             toast.error(err.message);
//             console.error(err);
//         }
//     };

//     const getPostTypeClass = (type) => {
//         switch (type) {
//             case 'שאלה': return styles['type-question'];
//             case 'שיתוף': return styles['type-share'];
//             case 'טיפ': return styles['type-tip'];
//             case 'זיכרון': return styles['type-memory'];
//             case 'המלצה': return styles['type-recommendation'];
//             case 'אחר': return styles['type-other'];
//             default: return '';
//         }
//     };

//     return (
//         <div className={styles.postContainer}>
//             <div className={styles.postHeader}>
//                 <span>תאריך כתיבת ההודעה: {new Date(post.created_at).toLocaleString()}</span>
//                 <span>נכתב על ידי: {post.author_name}</span>
//             </div>
//             <div className={`${styles.postTypeTag} ${getPostTypeClass(post.post_type)}`}>
//                 {post.post_type}
//             </div>
//             <h3 className={styles.postTitle}>{post.title}</h3>
//             <p className={styles.postBody}>{post.body}</p>

//             {post.media_url && (
//                 <div className={styles.mediaContent}>
//                     {post.media_url.match(/\.(jpeg|jpg|gif|png)(\?.*)?$/i) ? (
//                         <img src={post.media_url} alt="post media" className={styles.mediaImage} />
//                     ) : post.media_url.match(/\.(mp4|webm|ogg)(\?.*)?$/i) ? (
//                         <video controls className={styles.mediaVideo}>
//                             <source src={post.media_url} />
//                         </video>
//                     ) : null}
//                 </div>
//             )}

//             <div className={styles.likesSection}>
//                 <button type="button" onClick={() => handleToggleLike(post)}>
//                     {post.user_liked ? '❤️' : '🤍'}
//                 </button>
//                 <span>{post.likes_count}</span>
//             </div>

//             {currentUser.id === post.user_id && (
//                 <div className={styles.actions}>
//                     <button onClick={() => navigate('/posts/edit', { state: { fromPost: post } })}>ערוך</button>
//                     <button type="button" onClick={() => handleDelete(post.id)}>🗑️</button>
//                 </div>
//             )}

//             <div className={styles.postMeta}>
//                 <button
//                     type="button"
//                     onClick={() => setShowComments((prev) => !prev)}
//                     className={styles.toggleCommentsButton}
//                 >
//                     {showComments ? 'הסתר תגובות' : 'הצג תגובות'}
//                 </button>
//             </div>

//             {showComments && <Comments postId={post.id} />}
//         </div>
//     );
// };

// export default SinglePost;
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCurrentUser } from '../hooks/useCurrentUser';
import styles from './postStyle/SinglePost.module.css';
import Comments from '../comments/Comments';
import { toast } from 'react-toastify';
import ApiClientRequests from '../../ApiClientRequests';

const SinglePost = ({ post, refreshPost, deletePost }) => {
    const { currentUser, loading } = useCurrentUser();
    const [showComments, setShowComments] = useState(false);
    const navigate = useNavigate();

    if (loading || !currentUser) return null;
    const handleDelete = async (id) => {
        try {
            const res = await ApiClientRequests.deleteRequest(`posts/${id}`);
            if (res?.success) {
                deletePost(id);
                toast.success('הפוסט נמחק בהצלחה');
            } else {
                toast.error('לא ניתן היה למחוק את הפוסט');
            }
        } catch (err) {
            toast.error(err.message);
            console.error(err);
        }
    };



    const handleToggleLike = async () => {
        try {
            const method = post.user_liked ? 'DELETE' : 'POST';
            await ApiClientRequests[method === 'POST' ? 'postRequest' : 'deleteRequest'](`posts/${post.id}/likes`);
            refreshPost({
                id: post.id,
                likes_count: post.likes_count + (post.user_liked ? -1 : 1),
                user_liked: !post.user_liked
            });
        } catch (err) {
            toast.error(err.message);
            console.error(err);
        }
    };


    const getPostTypeClass = (type) => {
        switch (type) {
            case 'שאלה': return styles['type-question'];
            case 'שיתוף': return styles['type-share'];
            case 'טיפ': return styles['type-tip'];
            case 'זיכרון': return styles['type-memory'];
            case 'המלצה': return styles['type-recommendation'];
            case 'אחר': return styles['type-other'];
            default: return '';
        }
    };

    return (
        <div className={styles.postContainer}>
            <div className={styles.postHeader}>
                <span>תאריך כתיבת ההודעה: {new Date(post.created_at).toLocaleString()}</span>
                <span>נכתב על ידי: {post.author_name}</span>
            </div>
            <div className={`${styles.postTypeTag} ${getPostTypeClass(post.post_type)}`}>
                {post.post_type}
            </div>
            <h3 className={styles.postTitle}>{post.title}</h3>
            <p className={styles.postBody}>{post.body}</p>

            {post.media_url && (
                <div className={styles.mediaContent}>
                    {post.media_url.match(/\.(jpeg|jpg|gif|png)(\?.*)?$/i) ? (
                        <img src={post.media_url} alt="post media" className={styles.mediaImage} />
                    ) : post.media_url.match(/\.(mp4|webm|ogg)(\?.*)?$/i) ? (
                        <video controls className={styles.mediaVideo}>
                            <source src={post.media_url} />
                        </video>
                    ) : null}
                </div>
            )}

            <div className={styles.likesSection}>
                <button type="button" onClick={handleToggleLike}>
                    {post.user_liked ? '❤️' : '🤍'}
                </button>
                <span>{post.likes_count}</span>
            </div>

            {currentUser.id === post.user_id && (
                <div className={styles.actions}>
                    <button onClick={() => navigate('/posts/edit', { state: { fromPost: post } })}>ערוך</button>
                    <button type="button" onClick={() => handleDelete(post.id)}>🗑️</button>
                </div>
            )}

            <div className={styles.postMeta}>
                <button
                    type="button"
                    onClick={() => setShowComments((prev) => !prev)}
                    className={styles.toggleCommentsButton}
                >
                    {showComments ? 'הסתר תגובות' : 'הצג תגובות'}
                </button>
            </div>

            {showComments && <Comments postId={post.id} />}
        </div>
    );
};

export default SinglePost;
