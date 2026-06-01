import express from 'express';
import TestResult from '../models/TestResult.js';

const router = express.Router();

// @desc    Get all test results
// @route   GET /api/tests
router.get('/', async (req, res) => {
  try {
    const tests = await TestResult.find().sort({ dateTaken: -1 });
    res.json(tests);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// @desc    Create a new test result
// @route   POST /api/tests
router.post('/', async (req, res) => {
  const { title, stage, dateTaken, totalScore, timeTaken, accuracy, sections } = req.body;

  try {
    const newTest = new TestResult({
      title,
      stage,
      dateTaken,
      totalScore,
      timeTaken,
      accuracy,
      sections,
    });

    const savedTest = await newTest.save();
    res.status(201).json(savedTest);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// @desc    Delete a test result
// @route   DELETE /api/tests/:id
router.delete('/:id', async (req, res) => {
  try {
    const test = await TestResult.findById(req.params.id);
    if (!test) {
      return res.status(404).json({ message: 'Test result not found' });
    }
    await test.deleteOne();
    res.json({ message: 'Test result removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;