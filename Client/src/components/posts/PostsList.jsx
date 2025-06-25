
// import { useRef, useEffect, useState } from 'react';
// import SinglePost from './SinglePost.jsx';
// import Nav from '../nav/nav.jsx';
// import { useCurrentUser } from '../hooks/useCurrentUser.js';
// import styles from './postStyle/PostsList.module.css';
// import { toast } from 'react-toastify';
// import PostModal from './PostModal.jsx';
// import { useNavigate, useLocation } from 'react-router-dom';
// import ApiClientRequests from '../../ApiClientRequests.js';

// const PostsList = () => {
//     const { currentUser, loading } = useCurrentUser();
//     const [posts, setPosts] = useState([]);
//     const [error, setError] = useState(null);
//     const [postsLoading, setPostsLoading] = useState(true);
//     const [showAddModal, setShowAddModal] = useState(false);
//     const [postToEdit, setPostToEdit] = useState(null);
//     const [filterPostType, setFilterPostType] = useState("");
//     const [filterMyPosts, setFilterMyPosts] = useState(false);
//     const [sortCriteria, setSortCriteria] = useState("newest");
//     const [visibleCount, setVisibleCount] = useState(10);
//     const lastPostIdRef = useRef(null); // ID לפוסט שהופעל עליו לייק/מחיקה

//     const navigate = useNavigate();
//     const location = useLocation();

//     const fetchPosts = async () => {
//         try {
//             setPostsLoading(true);
//             const data = await ApiClientRequests.getRequest('posts');
//             setPosts(data);
//         } catch (err) {
//             toast.error(err.message);
//             setError(err.message);
//         } finally {
//             setPostsLoading(false);
//         }
//     };

//     const fetchPostsWithScroll = async (focusedPostId = null) => {
//         if (focusedPostId) lastPostIdRef.current = focusedPostId;
//         await fetchPosts();

//         setTimeout(() => {
//             if (lastPostIdRef.current) {
//                 const el = document.getElementById(`post-${lastPostIdRef.current}`);
//                 if (el) {
//                     const top = el.getBoundingClientRect().top + window.scrollY - 100;
//                     window.scrollTo({ top, behavior: 'smooth' });
//                 }
//                 lastPostIdRef.current = null;
//             }
//         }, 100);
//     };

//     useEffect(() => {
//         if (currentUser) fetchPosts();
//     }, [currentUser]);

//     useEffect(() => {
//         if (location.pathname === '/posts/new') {
//             setShowAddModal(true);
//             setPostToEdit(null);
//         } else if (location.pathname === '/posts/edit' && location.state?.fromPost) {
//             setPostToEdit(location.state.fromPost);
//             setShowAddModal(true);
//         } else {
//             setShowAddModal(false);
//             setPostToEdit(null);
//         }
//     }, [location]);

//     const handleAddPost = async ({ formData }) => {
//         try {
//             await ApiClientRequests.postFormData('posts', formData);
//             toast.success('הפוסט נוסף בהצלחה');
//             await fetchPosts();
//             navigate('/posts');
//         } catch (err) {
//             toast.error(err.message || 'שגיאה לא צפויה בהוספת הפוסט');
//             setError(err.message);
//         }
//     };

//     const handleUpdatePost = async ({ id, formData }) => {
//         try {
//             await ApiClientRequests.formPatch(`posts/${id}`, formData);
//             toast.success('הפוסט עודכן בהצלחה');
//             await fetchPosts();
//             navigate('/posts');
//         } catch (err) {
//             toast.error(err.message || 'שגיאה בעדכון הפוסט');
//         }
//     };

//     const handleLoadMore = () => setVisibleCount((prev) => prev + 10);

//     const handleEditPost = (post) => {
//         navigate('/posts/edit', { state: { fromPost: post } });
//     };

//     const filteredAndSortedPosts = posts
//         .filter((post) => {
//             if (filterPostType && post.post_type !== filterPostType) return false;
//             if (filterMyPosts && post.user_id !== currentUser.id) return false;
//             return true;
//         })
//         .sort((a, b) => {
//             if (sortCriteria === "newest") return new Date(b.created_at) - new Date(a.created_at);
//             if (sortCriteria === "oldest") return new Date(a.created_at) - new Date(b.created_at);
//             if (sortCriteria === "popular") return (b.likes_count || 0) - (a.likes_count || 0);
//             return 0;
//         });

//     const visiblePosts = filteredAndSortedPosts.slice(0, visibleCount);

//     if (loading) return <p>Loading user...</p>;
//     if (!currentUser) return <p>You must be logged in.</p>;
//     if (postsLoading) return <p>Loading posts...</p>;
//     if (error) return <p>Error: {error}</p>;

//     return (
//         <>
//             <Nav />
//             <div>
//                 <h2>פוסטים</h2>
//                 <div>
//                     <button onClick={() => navigate('/posts/new')}>הוסף פוסט</button>

//                     {showAddModal && (
//                         <PostModal
//                             onSave={postToEdit ? handleUpdatePost : handleAddPost}
//                             initialPost={postToEdit}
//                         />
//                     )}

//                     <label>
//                         סינון לפי סוג פוסט:
//                         <select value={filterPostType} onChange={(e) => setFilterPostType(e.target.value)}>
//                             <option value="">הצג הכל</option>
//                             <option value="שאלה">שאלה</option>
//                             <option value="זיכרון">זיכרון</option>
//                             <option value="טיפ">טיפ</option>
//                             <option value="שיתוף">שיתוף</option>
//                             <option value="המלצה">המלצה</option>
//                             <option value="אחר">אחר</option>
//                         </select>
//                     </label>

//                     <button onClick={() => setFilterMyPosts((prev) => !prev)}>
//                         {filterMyPosts ? "כל הפוסטים" : "הפוסטים שלי"}
//                     </button>

//                     <label>
//                         מיון:
//                         <select value={sortCriteria} onChange={(e) => setSortCriteria(e.target.value)}>
//                             <option value="newest">הכי חדש</option>
//                             <option value="oldest">הכי ישן</option>
//                             <option value="popular">פופולרי</option>
//                         </select>
//                     </label>
//                 </div>

//                 {visiblePosts.length === 0 ? (
//                     <p>לא נמצאו פוסטים מתאימים לסינון שנבחר.</p>
//                 ) : (
//                     visiblePosts.map((post) => (
//                         <div key={post.id} id={`post-${post.id}`}>
//                             <SinglePost
//                                 post={post}
//                                 fetchPosts={fetchPostsWithScroll}
//                             />
//                         </div>
//                     ))
//                 )}

//                 {visibleCount < filteredAndSortedPosts.length && (
//                     <button onClick={handleLoadMore}>טען עוד</button>
//                 )}

//                 {visibleCount > 10 && (
//                     <button onClick={() => setVisibleCount(10)}>חזור להתחלה</button>
//                 )}
//             </div>
//         </>
//     );
// };

import { useRef, useEffect, useState } from 'react';
import SinglePost from './SinglePost.jsx';
import Nav from '../nav/nav.jsx';
import { useCurrentUser } from '../hooks/useCurrentUser.js';
import styles from './postStyle/PostsList.module.css';
import { toast } from 'react-toastify';
import PostModal from './PostModal.jsx';
import { useNavigate, useLocation } from 'react-router-dom';
import ApiClientRequests from '../../ApiClientRequests.js';

const PostsList = () => {
    const { currentUser, loading } = useCurrentUser();
    const [posts, setPosts] = useState([]);
    const [error, setError] = useState(null);
    const [postsLoading, setPostsLoading] = useState(true);
    const [showAddModal, setShowAddModal] = useState(false);
    const [postToEdit, setPostToEdit] = useState(null);
    const [filterPostType, setFilterPostType] = useState("");
    const [filterMyPosts, setFilterMyPosts] = useState(false);
    const [sortCriteria, setSortCriteria] = useState("newest");
    const lastPostIdRef = useRef(null);
    const navigate = useNavigate();
    const location = useLocation();
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);

    const fetchPosts = async (pageToFetch = 1, limit = 10) => {
        try {
            setPostsLoading(true);
            const data = await ApiClientRequests.getRequest(`posts?page=${pageToFetch}&limit=${limit}`);

            if (pageToFetch === 1) {
                setPosts(data);
            } else {
                setPosts((prev) => [...prev, ...data]);
            }

            if (data.length < limit) {
                setHasMore(false);
            } else {
                setHasMore(true);
            }

            setPage(pageToFetch);
        } catch (err) {
            toast.error(err.message);
            setError(err.message);
        } finally {
            setPostsLoading(false);
        }
    };
const refreshSinglePost = (partialUpdate) => {
    setPosts((prev) =>
        prev.map((post) => {
            if (post.id !== partialUpdate.id) return post;
            return { ...post, ...partialUpdate };
        })
    );
};

    const handleDeletePost = (id) => {
        setPosts((prev) => prev.filter((post) => post.id !== id));
    };

    const fetchPostsWithScroll = (focusedPostId = null) => {
        if (focusedPostId) {
            const el = document.getElementById(`post-${focusedPostId}`);
            if (el) {
                const top = el.getBoundingClientRect().top + window.scrollY - 100;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        }
    };

    useEffect(() => {
        if (currentUser && posts.length === 0) {
            setPage(1);
            setHasMore(true);
            fetchPosts(1);
        }
    }, [currentUser]);

    useEffect(() => {
        if (location.pathname === '/posts/new') {
            setShowAddModal(true);
            setPostToEdit(null);
        } else if (location.pathname === '/posts/edit' && location.state?.fromPost) {
            setPostToEdit(location.state.fromPost);
            setShowAddModal(true);
        } else {
            setShowAddModal(false);
            setPostToEdit(null);
        }
    }, [location]);

    const handleAddPost = async ({ formData }) => {
        try {
            const addedPost = await ApiClientRequests.postFormData('posts', formData);
            toast.success('הפוסט נוסף בהצלחה');
            setPosts((prev) => [addedPost, ...prev]);
            setShowAddModal(false);
            fetchPostsWithScroll(addedPost.id);
        } catch (err) {
            toast.error(err.message || 'שגיאה לא צפויה בהוספת הפוסט');
            setError(err.message);
        }
    };

    const handleUpdatePost = async ({ id, formData }) => {
        try {
            const updatedPost = await ApiClientRequests.formPatch(`posts/${id}`, formData);
            toast.success('הפוסט עודכן בהצלחה');
            setPosts((prev) => prev.map((post) => (post.id === id ? updatedPost : post)));
            setShowAddModal(false);
            fetchPostsWithScroll(id);
        } catch (err) {
            toast.error(err.message || 'שגיאה בעדכון הפוסט');
        }
    };

    const handleLoadMore = () => {
        setPage((prevPage) => {
            const nextPage = prevPage + 1;
            fetchPosts(nextPage);
            return nextPage;
        });
    };

    const filteredAndSortedPosts = posts
        .filter((post) => {
            if (filterPostType && post.post_type !== filterPostType) return false;
            if (filterMyPosts && post.user_id !== currentUser.id) return false;
            return true;
        })
        .sort((a, b) => {
            if (sortCriteria === "newest") return new Date(b.created_at) - new Date(a.created_at);
            if (sortCriteria === "oldest") return new Date(a.created_at) - new Date(b.created_at);
            if (sortCriteria === "popular") return (b.likes_count || 0) - (a.likes_count || 0);
            return 0;
        });

    if (loading) return <p>Loading user...</p>;
    if (!currentUser) return <p>You must be logged in.</p>;
    if (postsLoading && posts.length === 0) return <p>Loading posts...</p>;
    if (error) return <p>Error: {error}</p>;

    return (
        <>
            <Nav />
            <div>
                <h2>פוסטים</h2>
                <div>
                    <button onClick={() => navigate('/posts/new')}>הוסף פוסט</button>

                    {showAddModal && (
                        <PostModal
                            onSave={postToEdit ? handleUpdatePost : handleAddPost}
                            initialPost={postToEdit}
                        />
                    )}

                    <label>
                        סינון לפי סוג פוסט:
                        <select value={filterPostType} onChange={(e) => setFilterPostType(e.target.value)}>
                            <option value="">הצג הכל</option>
                            <option value="שאלה">שאלה</option>
                            <option value="זיכרון">זיכרון</option>
                            <option value="טיפ">טיפ</option>
                            <option value="שיתוף">שיתוף</option>
                            <option value="המלצה">המלצה</option>
                            <option value="אחר">אחר</option>
                        </select>
                    </label>

                    <button onClick={() => setFilterMyPosts((prev) => !prev)}>
                        {filterMyPosts ? "כל הפוסטים" : "הפוסטים שלי"}
                    </button>

                    <label>
                        מיון:
                        <select value={sortCriteria} onChange={(e) => setSortCriteria(e.target.value)}>
                            <option value="newest">הכי חדש</option>
                            <option value="oldest">הכי ישן</option>
                            <option value="popular">פופולרי</option>
                        </select>
                    </label>
                </div>

                {filteredAndSortedPosts.length === 0 ? (
                    <p>לא נמצאו פוסטים מתאימים לסינון שנבחר.</p>
                ) : (
                    filteredAndSortedPosts.map((post) => (
                        <div key={post.id} id={`post-${post.id}`}>
                            <SinglePost post={post} refreshPost={refreshSinglePost} deletePost={handleDeletePost} />
                        </div>
                    ))
                )}

                {hasMore && !postsLoading && (
                    <button onClick={handleLoadMore}>טען עוד</button>
                )}
            </div>
        </>
    );
};

export default PostsList;
