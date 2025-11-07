import React, { useState } from 'react';
import API from '../api';

export default function CreatePost({ addPost }) {
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!content.trim()) {
      setError('Post content cannot be empty.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await API.post('/posts', { content: content.trim() });
      addPost(response.data);
      setContent('');
    } catch (err) {
      const message = err.response?.data?.msg || 'Failed to create post. Please try again.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-6 rounded-lg bg-white p-4 shadow-md">
      <h2 className="mb-4 text-xl font-semibold text-gray-800">Create a new post</h2>
      <form onSubmit={handleSubmit}>
        <textarea
          className="w-full rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows="4"
          placeholder="What's on your mind?"
          value={content}
          onChange={(event) => setContent(event.target.value)}
        />
        {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
        <div className="mt-4 flex justify-end">
          <button
            type="submit"
            className="rounded-lg bg-blue-600 px-6 py-2 text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={loading}
          >
            {loading ? 'Posting...' : 'Post'}
          </button>
        </div>
      </form>
    </div>
  );
}