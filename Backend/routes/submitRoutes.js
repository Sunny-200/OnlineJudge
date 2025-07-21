const express = require('express');
const router = express.Router();
const axios = require('axios');
const Problem = require('../models/Problem');

// POST /api/submit/run - for custom input
router.post('/run', async (req, res) => {
  const { code, language, input } = req.body;
  try {
    const result = await runCodeOnJudge({ code, language, input });
    res.json({ output: result.output });
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ message: 'Error running code', error: err.response?.data || err.message });
  }
});

// POST /api/submit - for submission
router.post('/', async (req, res) => {
  const { code, language, problemId } = req.body;
  try {
    const problem = await Problem.findById(problemId);
    if (!problem) {
      return res.status(404).json({ message: 'Problem not found' });
    }

    let allPassed = true;
    const details = [];

    for (const tc of problem.testCases) {
      const result = await runCodeOnJudge({ code, language, input: tc.input });
      const actual = (result.output || '').trim().replace(/\r/g, '');
      const expected = (tc.expectedOutput || '').trim().replace(/\r/g, '');

      const passed = actual === expected;
      details.push({ input: tc.input, expected, actual, passed });

      if (!passed) allPassed = false;
    }

    res.json({
      allPassed,
      details,
      message: allPassed ? '✅ All test cases passed!' : '❌ Some test cases failed'
    });

  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ message: 'Error submitting code', error: err.response?.data || err.message });
  }
});

// Real Judge0 API call
async function runCodeOnJudge({ code, language, input }) {
  const langId = mapLanguage(language);
  const response = await axios.post(
    'https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=false&wait=true',
    {
      source_code: code,
      language_id: langId,
      stdin: input
    },
    {
      headers: {
        'Content-Type': 'application/json',
        'X-RapidAPI-Key': 'f427bd309bmsh45927ce966bcccdp1c1034jsn07fcf491cef2', // replace with your key!
        'X-RapidAPI-Host': 'judge0-ce.p.rapidapi.com'
      }
    }
  );

  return {
    output: response.data.stdout || response.data.stderr || response.data.compile_output || 'No output'
  };
}

function mapLanguage(language) {
  const map = {
    cpp: 54,
    c: 50,
    java: 62,
    python: 71,
    javascript: 63
  };
  return map[language] || 54;
}

module.exports = router;
