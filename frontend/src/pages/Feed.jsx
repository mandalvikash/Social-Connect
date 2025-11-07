import React, { useState, useEffect } from 'react';
import API from '../api';
import PostCard from '../components/PostCard';
import CreateComment from '../components/CreateComment';
import Comment from '../components/Comment';

export default function Feed() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openComments, setOpenComments] = useState(null); // postId
  const [commentsByPost, setCommentsByPost] = useState({}); // { [postId]: Comment[] }

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await API.get('/posts');
        setPosts(response.data);
      } catch (err) {
        const message = err.response?.data?.msg || 'Failed to fetch posts. Please try again later.';
        setError(message);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const addPost = (post) => {
    setPosts((prevPosts) => [post, ...prevPosts]);
  };

  const toggleComments = async (postId) => {
    if (openComments === postId) {
      setOpenComments(null);
      return;
    }
    setOpenComments(postId);
    if (!commentsByPost[postId]) {
      try {
        const res = await API.get(`/comments/post/${postId}`);
        setCommentsByPost((prev) => ({ ...prev, [postId]: res.data }));
      } catch (err) {
        // Silent fail per-post to avoid breaking feed
      }
    }
  };

  const handleCommentCreated = (postId, newComment) => {
    setCommentsByPost((prev) => ({
      ...prev,
      [postId]: [newComment, ...(prev[postId] || [])],
    }));
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <h1 className="mb-6 text-3xl font-bold text-gray-800">Feed</h1>

        {loading && <p className="text-center text-gray-500">Loading posts...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}

        {!loading && !error && posts.length === 0 && (
          <p className="text-center text-gray-500">No posts yet. Be the first to share something!</p>
        )}

        <div className="mt-6 space-y-6">
          {posts.map((post) => (
            <div key={post._id} className="space-y-3">
              <PostCard
                post={post}
                onUpdatePost={(updated) =>
                  setPosts((prev) => prev.map((p) => (p._id === updated._id ? updated : p)))
                }
                onDeletePost={(id) => setPosts((prev) => prev.filter((p) => p._id !== id))}
              />
              <div className="mx-auto w-full max-w-2xl flex items-center gap-4 text-sm text-gray-600">
                <button
                  type="button"
                  onClick={() => toggleComments(post._id)}
                  className="rounded-md px-3 py-1 hover:bg-gray-200/60"
                >
                  {openComments === post._id ? 'Hide comments' : 'View comments'}
                </button>
              </div>
              {openComments === post._id && (
                <div className="mx-auto w-full max-w-2xl space-y-4 rounded-xl border border-gray-100 bg-white p-4 shadow-sm">
                  <h4 className="text-sm font-medium text-gray-700">
                    Comments {commentsByPost[post._id] ? `(${commentsByPost[post._id].length})` : ''}
                  </h4>
                  <CreateComment
                    postId={post._id}
                    onCommentCreated={(c) => handleCommentCreated(post._id, c)}
                  />
                  <div className="space-y-2">
                    {(commentsByPost[post._id] || []).map((comment) => (
                      <Comment key={comment._id} comment={comment} />
                    ))}
                    {commentsByPost[post._id] && commentsByPost[post._id].length === 0 && (
                      <p className="text-center text-xs text-gray-500">No comments yet.</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}