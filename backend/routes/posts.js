const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Post = require('../models/Post');


// POST /api/posts/ - create post
router.post('/', auth, async (req, res) => {
  const { content, image } = req.body;

  if (!content || !content.trim()) {
    return res.status(400).json({ msg: 'Post content is required' });
  }

  try {
    const post = new Post({ user: req.user.id, content: content.trim(), image });
    await post.save();
    await post.populate('user', 'name email');
    res.status(201).json(post);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});


// GET /api/posts/ - get all posts (latest first)
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find().populate('user', 'name').sort({ createdAt: -1 });
    res.json(posts);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// PUT /api/posts/:id - edit post (owner only)
router.put('/:id', auth, async (req, res) => {
  const { content, image } = req.body;
  if (!content || !content.trim()) {
    return res.status(400).json({ msg: 'Post content is required' });
  }
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ msg: 'Post not found' });
    if (post.user.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'Not authorized' });
    }
    post.content = content.trim();
    if (typeof image !== 'undefined') post.image = image;
    await post.save();
    await post.populate('user', 'name email');
    res.json(post);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// DELETE /api/posts/:id - delete post (owner only)
router.delete('/:id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ msg: 'Post not found' });
    if (post.user.toString() !== req.user.id) {
      return res.status(403).json({ msg: 'Not authorized' });
    }
    await post.deleteOne();
    res.json({ msg: 'Post deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// POST /api/posts/:id/like - toggle like
router.post('/:id/like', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ msg: 'Post not found' });
    const userId = req.user.id;
    const hasLiked = post.likes?.some((u) => u.toString() === userId);
    if (hasLiked) {
      post.likes = post.likes.filter((u) => u.toString() !== userId);
    } else {
      post.likes = [...(post.likes || []), userId];
    }
    await post.save();
    await post.populate('user', 'name email');
    res.json(post);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});


module.exports = router;