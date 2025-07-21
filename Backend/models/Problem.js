const mongoose = require('mongoose');

const problemSchema = new mongoose.Schema({
  title: { type: String, required: true },
  tags: [String],
  description: String,
  difficulty: { type: String, enum: ['Easy', 'Medium', 'Hard'], default: 'Easy' },
  constraints: String,
  inputFormat: String,
  outputFormat: String,
  testCases: [
    {
      input: String,
      expectedOutput: String,
      isHidden: Boolean
    }
  ],
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, { timestamps: true });

module.exports = mongoose.model('Problem', problemSchema);
