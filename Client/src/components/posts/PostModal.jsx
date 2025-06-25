
import React, { useState, useEffect } from 'react';
import styles from './postStyle/AddPostModal.module.css';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { z } from 'zod';

function PostModal({ onSave, initialPost = null }) {
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [postType, setPostType] = useState('');
    const [mediaFile, setMediaFile] = useState(null);
    const [removeMedia, setRemoveMedia] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (initialPost) {
            setTitle(initialPost.title || '');
            setBody(initialPost.body || '');
            setPostType(initialPost.post_type || '');
        }
    }, [initialPost]);

    const isValid = title && body && (postType || initialPost);

    const hasChanges = () => {
        if (!initialPost) return true;
        return (
            title !== initialPost.title ||
            body !== initialPost.body ||
            mediaFile !== null ||
            removeMedia
        );
    };

    const getPostSchema = (isNewPost) =>
        z.object({
            title: z.string().min(2, 'הכותרת חייבת להכיל לפחות 2 תווים'),
            body: z.string().min(5, 'התוכן חייב להכיל לפחות 5 תווים'),
            postType: isNewPost
                ? z.string().min(1, 'חובה לבחור סוג פוסט')
                : z.string().optional(),
            mediaFile: z
                .any()
                .optional()
                .refine(
                    (file) =>
                        !file || /\.(jpg|jpeg|png|gif|mp4|mov|webm)$/i.test(file.name),
                    { message: 'סוג קובץ לא נתמך' }
                ),
        });

    const handleSubmit = async () => {
        const schema = getPostSchema(!initialPost);
        const result = schema.safeParse({
            title,
            body,
            postType,
            mediaFile,
        });

        if (!result.success) {
            const errorMessages = result.error.errors.map((e) => e.message).join(' | ');
            toast.error(errorMessages);
            return;
        }

        if (!hasChanges()) {
            toast.info('לא בוצע שינוי, לא נשלחה בקשה');
            navigate('/posts');
            return;
        }

        const formData = new FormData();
        formData.append('title', title);
        formData.append('body', body);
        formData.append('post_type', postType || initialPost?.post_type || '');
        formData.append('removeMedia', removeMedia);
        if (mediaFile) formData.append('media', mediaFile);

        try {
            await onSave({ id: initialPost?.id, formData });
            navigate('/posts');
        } catch (err) {
            console.error(err);
            toast.error('שגיאה בשמירת הפוסט');
        }
    };

    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <h2>{initialPost ? 'עריכת פוסט' : 'הוספת פוסט חדש'}</h2>

                <label>כותרת:</label>
                <input value={title} onChange={(e) => setTitle(e.target.value)} />

                <label>תוכן:</label>
                <textarea value={body} onChange={(e) => setBody(e.target.value)} />

                {!initialPost && (
                    <>
                        <label>סוג פוסט:</label>
                        <select value={postType} onChange={(e) => setPostType(e.target.value)}>
                            <option value="">-- בחר סוג פוסט --</option>
                            <option value="שאלה">שאלה</option>
                            <option value="זיכרון">זיכרון</option>
                            <option value="טיפ">טיפ</option>
                            <option value="שיתוף">שיתוף</option>
                            <option value="המלצה">המלצה</option>
                            <option value="אחר">אחר</option>
                        </select>
                    </>
                )}

                {initialPost?.media_url && !removeMedia && (
                    <div>
                        <p>מדיה קיימת:</p>
                        {initialPost.media_url.match(/\.(jpg|jpeg|png|gif)$/i) ? (
                            <img src={initialPost.media_url} alt="media" className={styles.mediaPreview} />
                        ) : (
                            <video src={initialPost.media_url} controls className={styles.mediaPreview} />
                        )}
                        <button onClick={() => setRemoveMedia(true)}>הסר מדיה</button>
                    </div>
                )}

                {(removeMedia || !initialPost?.media_url) && (
                    <div>
                        <label>העלה מדיה:</label>
                        <input type="file" onChange={(e) => setMediaFile(e.target.files[0])} />
                    </div>
                )}

                <div className={styles.actions}>
                    <button onClick={handleSubmit} disabled={!isValid}>שמור</button>
                    <button onClick={() => navigate('/posts')}>ביטול</button>
                </div>
            </div>
        </div>
    );
}

export default PostModal;
