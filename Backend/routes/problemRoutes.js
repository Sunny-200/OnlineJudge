const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth');
const {
  createProblem,
  getAllProblems,
  getProblemById
} = require('../controllers/problemController');

router.post('/create', authMiddleware, createProblem);
router.get('/', getAllProblems);
router.get('/:id', getProblemById);

module.exports = router;
