import mongoose from 'mongoose';

const keywordDensitySchema = new mongoose.Schema({
  keyword: String,
  count: Number,
  density: Number, // percentage
});

const projectImprovementSchema = new mongoose.Schema({
  original: String,
  improved: String,
  rationale: String,
});

const analysisSchema = new mongoose.Schema(
  {
    resume: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Resume',
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    jobDescription: {
      type: String,
      default: '',
    },
    scores: {
      overall: { type: Number, required: true },
      ats: { type: Number, required: true },
      skills: { type: Number, required: true },
      experience: { type: Number, required: true },
      formatting: { type: Number, required: true },
      readability: { type: Number, required: true },
    },
    details: {
      skillsFound: [String],
      skillsMissing: [String],
      softSkills: [String],
      keywordDensity: [keywordDensitySchema],
      formattingIssues: [String],
      strengths: [String],
      weaknesses: [String],
    },
    suggestions: {
      improvedSummary: String,
      improvedProjects: [projectImprovementSchema],
      keywordsToSuggest: [String],
      skillsToLearn: [String],
      interviewPrep: [String],
    },
  },
  {
    timestamps: true,
  }
);

const Analysis = mongoose.model('Analysis', analysisSchema);
export default Analysis;
