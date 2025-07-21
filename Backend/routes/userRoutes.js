const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { authMiddleware } = require('../middleware/auth');

// Mark problem as solved
router.post('/mark-solved', authMiddleware, async (req, res) => {
  const { userId, problemId } = req.body;

  await User.findByIdAndUpdate(userId, {
    $addToSet: { solvedProblems: problemId }
  });

  res.json({ success: true });
});

// Get solved problems for user
router.get('/:userId/solved', authMiddleware, async (req, res) => {
  const user = await User.findById(req.params.userId);
  res.json({ solvedProblems: user.solvedProblems });
});

module.exports = router;
