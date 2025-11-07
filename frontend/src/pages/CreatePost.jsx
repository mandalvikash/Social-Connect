import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import API from '../api';

export default function CreatePostPage() {
  const navigate = useNavigate();
  const [content, setContent] = useState('');
  const [error, setError] = useState('');
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    if (!content.trim()) {
      setError('Post content cannot be empty.');
      return;
    }

    setLoading(true);
    setError('');
    try {
      let image;
      if (file) {
        const form = new FormData();
        form.append('image', file);
        const uploadRes = await API.post('/uploads', form, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        image = uploadRes.data.url;
      }

      await API.post('/posts', { content: content.trim(), image });
      navigate('/feed');
    } catch (err) {
      const msg = err.response?.data?.msg || 'Failed to create post. Please try again.';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <h1 className="mb-6 text-3xl font-bold text-gray-800">Create Post</h1>
        <form onSubmit={submit} className="rounded-lg bg-white p-6 shadow-md">
          <label className="mb-2 block text-sm font-medium text-gray-700">Content</label>
          <textarea
            className="w-full rounded-lg border border-gray-300 p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows="6"
            placeholder="What's on your mind?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <div className="mt-4">
            <label className="mb-2 block text-sm font-medium text-gray-700">Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="block w-full text-sm text-gray-700 file:mr-4 file:rounded-md file:border-0 file:bg-blue-50 file:px-4 file:py-2 file:text-blue-700 hover:file:bg-blue-100"
            />
            {file && <p className="mt-1 text-xs text-gray-500">Selected: {file.name}</p>}
          </div>
          {error && <p className="mt-2 text-sm text-red-500">{error}</p>}
          <div className="mt-4 flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="rounded-lg bg-blue-600 px-6 py-2 text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? 'Posting...' : 'Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}


