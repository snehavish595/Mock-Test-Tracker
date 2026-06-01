import mongoose from 'mongoose';

const testResultSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    stage: {
      type: String,
      required: true,
      enum: ['Prelims', 'Mains'],
    },
    dateTaken: {
      type: Date,
      required: true,
    },
    totalScore: {
      type: Number,
      required: true,
    },
    timeTaken: {
      type: Number, // in minutes
      required: true,
    },
    accuracy: {
      type: Number, // percentage
      required: true,
    },
    sections: {
      english: { type: Number, default: 0 },
      reasoning: { type: Number, default: 0 },
      quantOrGa: { type: Number, default: 0 }, // Quantitative Aptitude or General Awareness
      professionalKnowledge: { type: Number, default: 0 },
    },
  },
  {
    timestamps: true,
  }
);

const TestResult = mongoose.model('TestResult', testResultSchema);
export default TestResult;