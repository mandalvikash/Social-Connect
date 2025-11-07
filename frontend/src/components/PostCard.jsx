import React, { useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import API from '../api';

export default function PostCard({ post, onUpdatePost, onDeletePost }) {
  const author = post.user || {};
  const avatarSeed = encodeURIComponent(author.name || 'User');
  const createdAt = post.createdAt ? new Date(post.createdAt).toLocaleString() : '';
  const currentUserId = useSelector((state) => state.user.user?.id || state.user.user?._id);
  const isOwner = useMemo(() => {
    const authorId = author.id || author._id;
    return authorId && currentUserId && authorId === currentUserId;
  }, [author, currentUserId]);

  const [editing, setEditing] = useState(false);
  const [content, setContent] = useState(post.content || '');
  const [busy, setBusy] = useState(false);

  const likeCount = post.likes ? post.likes.length : 0;
  const hasLiked = useMemo(() => {
    if (!post.likes || !currentUserId) return false;
    return post.likes.some((u) => (u.id || u._id || u) === currentUserId);
  }, [post.likes, currentUserId]);

  const toggleLike = async () => {
    try {
      const res = await API.post(`/posts/${post._id}/like`);
      onUpdatePost?.(res.data);
    } catch (_) {
      // no-op
    }
  };

  const saveEdit = async () => {
    if (!content.trim()) return;
    setBusy(true);
    try {
      const res = await API.put(`/posts/${post._id}`, { content: content.trim() });
      onUpdatePost?.(res.data);
      setEditing(false);
    } catch (_) {
      // no-op
    } finally {
      setBusy(false);
    }
  };

  const deletePost = async () => {
    if (!confirm('Delete this post?')) return;
    setBusy(true);
    try {
      await API.delete(`/posts/${post._id}`);
      onDeletePost?.(post._id);
    } catch (_) {
      // no-op
    } finally {
      setBusy(false);
    }
  };

  const imageUrl = useMemo(() => {
    if (!post.image) return null;
    // If backend already returned absolute URL, use it.
    if (/^https?:\/\//i.test(post.image)) return post.image;
    // Otherwise, prefix backend origin from axios baseURL
    const apiBase = API.defaults.baseURL || '';
    const origin = apiBase.replace(/\/?api\/?$/, '').replace(/\/$/, '');
    return `${origin}${post.image.startsWith('/') ? '' : '/'}${post.image}`;
  }, [post.image]);

  return (
    <article className="mx-auto w-full max-w-2xl rounded-lg bg-gray-150 p-6 shadow-md">

      <header className="mb-4 flex items-center gap-4">
        <img
          src={author.profilePicture || `https://api.dicebear.com/7.x/initials/svg?seed=${avatarSeed}`}
          alt={author.name || 'User avatar'}
          className="h-12 w-12 rounded-full object-cover"
        />
        <div>
          <p className="font-semibold text-gray-800">{author.name || 'Unknown user'}</p>
          {createdAt && <p className="text-sm text-gray-500">{createdAt}</p>}
        </div>
      </header>

      {!editing ? (
        <>
          <p className="whitespace-pre-line text-gray-700">{post.content}</p>
          {imageUrl && (
            <div className="mt-3 overflow-hidden rounded-lg border border-gray-100">
              <img
                src={imageUrl}
                alt="Post"
                className="w-64 h-48 object-cover rounded-lg"
              />
            </div>
          )}
        </>
      ) : (
        <div className="space-y-2">
          <textarea
            className="w-full rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="4"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <div className="flex items-center gap-2">
            <button
              type="button"
              disabled={busy}
              onClick={saveEdit}
              className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
            >
              Save
            </button>
            <button
              type="button"
              disabled={busy}
              onClick={() => {
                setEditing(false);
                setContent(post.content || '');
              }}
              className="rounded-md px-4 py-2 text-gray-700 hover:bg-gray-100"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="mt-4 flex items-center gap-4 text-sm text-gray-600">
        <button
          type="button"
          onClick={toggleLike}
          className="rounded-md px-3 py-1 hover:bg-gray-200/60"
        >
          {hasLiked ? 'Unlike' : 'Like'}{likeCount ? ` (${likeCount})` : ''}
        </button>
        <span className="text-gray-300">•</span>
        {isOwner && !editing && (
          <>
            <button
              type="button"
              onClick={() => setEditing(true)}
              className="rounded-md px-3 py-1 hover:bg-gray-200/60"
            >
              Edit
            </button>
            <button
              type="button"
              disabled={busy}
              onClick={deletePost}
              className="rounded-md px-3 py-1 text-red-600 hover:bg-red-50"
            >
              Delete
            </button>
          </>
        )}
      </div>
    </article>
  );
}