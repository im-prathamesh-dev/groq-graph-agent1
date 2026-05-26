# ResuMind AI: Full-Stack AI Resume & ATS Analyzer

ResuMind AI is a state-of-the-art, MERN-stack web application designed to parse, analyze, and optimize resumes against Applicant Tracking Systems (ATS) and target Job Descriptions. Leveraging **LangChain JS**, **Qdrant Vector Database**, and **Local Ollama Large Language Models**, it delivers semantic matching and detailed optimization feedback with complete data privacy.

---

## 🚀 Key Features

1. **JWT Authentication:** Secure user registrations, login sessions, and private route dashboards.
2. **Semantic Resume Uploads:** Multi-resume management featuring automated `.pdf`, `.txt`, and `.md` parsing.
3. **RAG (Retrieval-Augmented Generation):** Custom text splitter, semantic chunk vector indexing, and context-aware grading prompts.
4. **Job Description Screening:** Direct job-to-resume grading, semantic similarity matching, and gap analytics.
5. **Interactive Charts:** Recharts bar and circular gauges illustrating ATS scores, skills gaps, and category strength scores.
6. **Side-by-Side Version Diffing:** Retain historical file versions and compare revisions side-by-side to track score deltas.
7. **AI Cover Letter Wizard:** Draft fully customized applications based on resume profiles and targeted job descriptions.
8. **Admin Panel:** Aggregate metrics tracking active users, total resume uploads, and aggregated AI execution histories.
9. **DevOps Integration:** Complete container orchestration via Docker Compose.

---

## 🛠️ Technology Stack

- **Frontend:** React, Vite, Tailwind CSS, Framer Motion, Zustand, Recharts, Lucide Icons
- **Backend:** Node.js, Express, Multer, PDF-Parse
- **Database:** MongoDB (Structured storage)
- **Vector DB:** Qdrant Vector Database (Cosine similarity matching)
- **AI RAG Pipeline:** LangChain JS with Ollama
- **Local LLMs:** 
  - `nomic-embed-text` (768-dimension dense vector embeddings)
  - `llama3` (Structured prompt generation)

---

## ⚙️ Installation & Local Setup

To run the application locally without Docker, follow these steps:

### Prerequisites
- [Node.js v18+](https://nodejs.org) installed.
- [MongoDB Community Server](https://www.mongodb.com/try/download/community) running locally on port `27017`.
- [Qdrant](https://qdrant.tech/documentation/quick-start/) running locally on port `6333`.
- [Ollama](https://ollama.com) installed and running locally on port `11434`.

### Step 1: Install Ollama Models
Ensure Ollama is running and download the embedding and language models in your terminal:
```bash
ollama pull nomic-embed-text
ollama pull llama3
```

### Step 2: Configure & Launch Backend
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Boot the API development server:
   ```bash
   npm run dev
   ```
*The backend API will run on `http://localhost:5000`.*

### Step 3: Configure & Launch Frontend
1. Navigate to the frontend directory:
   ```bash
   cd ../frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Boot the client application:
   ```bash
   npm run dev
   ```
*The frontend client will run on `http://localhost:5173`.*

---

## 🐳 Containerized Setup via Docker Compose

Run the entire application, including databases and local AI services, using Docker:

1. Clone or navigate to the project root directory:
   ```bash
   cd lang-graph
   ```

2. Boot all services via Docker Compose:
   ```bash
   docker-compose up --build
   ```

3. **Verify the Ollama Models Inside the Container:**
   If running Ollama in docker, log into the container and pull the models:
   ```bash
   docker exec -it mern_ollama ollama pull nomic-embed-text
   docker exec -it mern_ollama ollama pull llama3
   ```

Once fully booted, access the client interface at `http://localhost:5173`.

---

## 📂 Project Architecture

```
lang-graph/
├── backend/
│   ├── src/
│   │   ├── config/          # MongoDB & Qdrant database clients
│   │   ├── models/          # User, Resume, Analysis, Cover Letter Schemas
│   │   ├── controllers/     # Controller layers for APIs
│   │   ├── middleware/      # Error, Logger, JWT auth middlewares
│   │   ├── routes/          # Express route structures
│   │   └── services/        # PDF extraction, LLM AI, & Qdrant RAG pipeline
│   ├── Dockerfile
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/      # UI Shell layouts, sidebars, uploads, chart visuals
│   │   ├── context/         # Light/Dark Theme controllers
│   │   ├── store/           # Zustand global state (Auth & Resume stores)
│   │   ├── pages/           # Landing, Dashboard, Matching, Admin screens
│   │   └── index.css        # Tailwind directives and glassmorphic designs
│   ├── Dockerfile
│   └── package.json
└── docker-compose.yml       # Application container orchestration
```

---

## 🔒 Security & Data Privacy

ResuMind AI is engineered to prioritize data privacy. All parsing and AI operations are processed on your local machine using Qdrant and Ollama. Resumes, credentials, and analysis metrics are completely secure and are never dispatched to public cloud instances.
