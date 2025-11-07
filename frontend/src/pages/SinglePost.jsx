import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import API from '../api';
import PostCard from '../components/PostCard';
import Comment from '../components/Comment';
import CreateComment from '../components/CreateComment';

export default function SinglePost() {
    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { postId } = useParams();

    useEffect(() => {
        const fetchPost = async () => {
            try {
                const [postRes, commentsRes] = await Promise.all([
                    API.get(`/posts/${postId}`),
                    API.get(`/comments/post/${postId}`),
                ]);
                setPost(postRes.data);
                setComments(commentsRes.data);
            } catch (err) {
                setError('Failed to fetch post. Please try again later.');
            } finally {
                setLoading(false);
            }
        };

        fetchPost();
    }, [postId]);

    const handleCommentCreated = (newComment) => {
        setComments([newComment, ...comments]);
    };

    if (loading) return <p className="text-center text-gray-500">Loading post...</p>;
    if (error) return <p className="text-center text-red-500">{error}</p>;
    if (!post) return <p className="text-center text-gray-500">Post not found.</p>;

    return (
        <div className="min-h-screen bg-gray-100">
            <div className="container mx-auto px-4 py-8">
                <PostCard post={post} />

                <div className="mt-6">
                    <CreateComment postId={postId} onCommentCreated={handleCommentCreated} />
                </div>

                <div className="mt-6 space-y-6">
                    {comments.length > 0 ? (
                        comments.map(comment => <Comment key={comment._id} comment={comment} />)
                    ) : (
                        <p className="text-center text-gray-500">No comments yet. Be the first to comment!</p>
                    )}
                </div>
            </div>
        </div>
    );
}