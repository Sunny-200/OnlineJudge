const Problem = require('../models/Problem');

const createProblem = async (req, res) => {
  try {
    const {
      title,
      tags,
      description,
      difficulty,
      constraints,
      inputFormat,
      outputFormat,
      testCases
    } = req.body;

    // Validate required fields
    if (!title || !tags || !description || !difficulty || !testCases || testCases.length === 0) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const problem = new Problem({
      title,
      tags,
      description,
      difficulty,
      constraints,
      inputFormat,
      outputFormat,
      testCases,
      createdBy: req.user.id // Make sure authMiddleware sets this
    });

    await problem.save();

    res.status(201).json({ message: '✅ Problem submitted successfully!', problem });
  } catch (err) {
    console.error('❌ Problem Submission Error:', err.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

const getAllProblems = async (req, res) => {
  try {
    const problems = await Problem.find({});
    res.json(problems);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch problems' });
  }
};

const getProblemById = async (req, res) => {
  try {
    const problem = await Problem.findById(req.params.id);
    if (!problem) return res.status(404).json({ error: 'Problem not found' });
    res.json(problem);
  } catch (err) {
    res.status(500).json({ error: 'Error fetching problem' });
  }
};

module.exports = {
  createProblem,
  getAllProblems,
  getProblemById
};
