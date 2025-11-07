const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Comment = require('../models/Comment');

// POST /api/comments - create a comment
router.post('/', auth, async (req, res) => {
  const { postId, content } = req.body;
  if (!postId || !content || !content.trim()) {
    return res.status(400).json({ msg: 'postId and content are required' });
  }

  try {
    const comment = new Comment({
      post: postId,
      user: req.user.id,
      content: content.trim(),
    });
    await comment.save();
    await comment.populate('user', 'name email');
    res.status(201).json(comment);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// GET /api/comments/post/:postId - list comments by post, newest first
router.get('/post/:postId', async (req, res) => {
  try {
    const comments = await Comment.find({ post: req.params.postId })
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    res.json(comments);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

module.exports = router;


