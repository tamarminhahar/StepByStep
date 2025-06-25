
import React, { useEffect, useState } from 'react';
import styles from './Comments.module.css';
import { useCurrentUser } from '../hooks/useCurrentUser';
import { toast } from 'react-toastify';
import { z } from 'zod';
import ApiClientRequests from '../../ApiClientRequests';

export default function Comments({ postId }) {
    const { currentUser } = useCurrentUser();
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [loading, setLoading] = useState(true);
    const [showAddComment, setShowAddComment] = useState(false);
    const [anonymous, setAnonymous] = useState(false);
    const [addingComment, setAddingComment] = useState(false);

    const commentSchema = z.object({
        content: z.string()
            .min(3, 'התגובה קצרה מדי (לפחות 3 תווים)')
            .max(500, 'התגובה ארוכה מדי (מקסימום 500 תווים)')
            .refine(val => val.trim().length > 0, 'התגובה אינה יכולה להכיל רק רווחים')
    });

    const fetchComments = async () => {
        try {
            const data = await ApiClientRequests.getRequest(`comments/${postId}/comments`);
            setComments(data);
        } catch (err) {
            toast.error(err.message);
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleAddComment = async () => {
        const result = commentSchema.safeParse({ content: newComment });
        if (!result.success) {
            const errorMessages = result.error.errors.map((e) => e.message).join(' | ');
            toast.error(errorMessages);
            return;
        }

        setAddingComment(true);
        try {
            await ApiClientRequests.postRequest(`comments/${postId}/comments`, {
                content: newComment.trim(),
                anonymous: anonymous,
            });

            toast.success('התגובה נוספה בהצלחה');
            setNewComment('');
            setAnonymous(false);
            setShowAddComment(false);
            await fetchComments();
        } catch (err) {
            toast.error(err.message);
            console.error(err);
        } finally {
            setAddingComment(false);
        }
    };

    const handleDeleteComment = async (commentId) => {
        try {
            await ApiClientRequests.deleteRequest(`comments/${commentId}`);
            toast.success('התגובה נמחקה');
        } catch (err) {
            toast.error(err.message || 'שגיאה לא צפויה במחיקה');
            console.error(err);
        } finally {
            await fetchComments();
        }
    };

    useEffect(() => {
        fetchComments();
    }, [postId]);

    if (loading) return <p>טוען תגובות...</p>;

    return (
        <div className={styles.commentsContainer}>
            <div className={styles.commentsHeader}>
                <span>תגובות נכתבו {comments.length}</span>
            </div>

            <div className={styles.commentsList}>
                {comments.length > 0 ? (
                    comments.map((comment) => (
                        <div key={comment.id} className={styles.commentItem}>
                            <div className={styles.commentContent}>{comment.content}</div>
                            <div className={styles.commentMeta}>
                                <span>נכתב ע"י: {comment.anonymous ? 'אנונימי' : comment.author_name}</span>
                                <span>תאריך: {new Date(comment.created_at).toLocaleString()}</span>
                            </div>
                            {currentUser.id === comment.user_id && (
                                <button
                                    className={styles.deleteCommentButton}
                                    onClick={() => handleDeleteComment(comment.id)}
                                >
                                    🗑️
                                </button>
                            )}
                        </div>
                    ))
                ) : (
                    <p className={styles.noComments}>אין תגובות עדיין.</p>
                )}
            </div>

            {!showAddComment && (
                <button
                    type="button"
                    className={styles.addCommentToggleButton}
                    onClick={() => setShowAddComment(true)}
                >
                    הוסף תגובה
                </button>
            )}

            {showAddComment && (
                <div className={styles.addCommentSection}>
                    <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        placeholder="כתוב תגובה..."
                        className={styles.addCommentInput}
                        rows="3"
                    />
                    <label>
                        <input
                            type="checkbox"
                            checked={anonymous}
                            onChange={(e) => setAnonymous(e.target.checked)}
                        />
                        אנונימי
                    </label>
                    <div className={styles.addCommentActions}>
                        <button className={styles.addCommentButton} onClick={handleAddComment} disabled={addingComment}>
                            {addingComment ? 'שולח...' : 'שלח'}
                        </button>
                        <button
                            className={styles.cancelCommentButton}
                            onClick={() => {
                                setShowAddComment(false);
                                setNewComment('');
                                setAnonymous(false);
                            }}
                        >
                            ביטול
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}

