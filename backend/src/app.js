import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'path';

// Import Middlewares
import { notFound, errorHandler } from './middleware/errorMiddleware.js';

// Import Routes
import authRoutes from './routes/auth.js';
import resumeRoutes from './routes/resumes.js';
import analysisRoutes from './routes/analyses.js';
import coverLetterRoutes from './routes/coverLetters.js';
import adminRoutes from './routes/admin.js';

// Load Env variables
dotenv.config();

const app = express();

// Standard Request Logger
if (process.env.NODE_ENV !== 'production') {
  app.use(morgan('dev'));
} else {
  app.use(morgan('combined'));
}

// Enable Cross-Origin Resource Sharing (CORS)
app.use(
  cors({
    origin: '*', // Allow all origins for simple integration, restrict as needed in production
    credentials: true,
  })
);

// Payload size limit increase to handle large document parsers
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

// Serve Uploaded Files statically
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Root operational healthcheck route
app.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'AI Resume Analyzer API running smoothly',
    timestamp: new Date(),
  });
});

// Bind Route Handlers
app.use('/api/auth', authRoutes);
app.use('/api/resumes', resumeRoutes);
app.use('/api/analyses', analysisRoutes);
app.use('/api/cover-letters', coverLetterRoutes);
app.use('/api/admin', adminRoutes);

// Unmatched Route Catchers
app.use(notFound);
app.use(errorHandler);

export default app;
