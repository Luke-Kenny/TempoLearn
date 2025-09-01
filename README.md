# TempoLearn – Adaptive AI Study Platform

**TempoLearn** is an adaptive study assistant that transforms academic PDFs into concise notes, interactive quizzes, and motivational feedback.  
It is built with a modern full-stack approach: **React + TypeScript + Vite** on the frontend, **Firebase** for authentication, hosting, and storage, and an **Express backend** integrated with **OpenAI** for content generation.

---

## Features

- Upload and parse academic PDFs
- AI-generated notes including summaries, key concepts, and insights
- Quiz generation across multiple formats: multiple choice, true/false, cloze, and short-answer
- Emotion logging with motivational feedback
- Dashboard with performance visualizations (scores over time, difficulty breakdowns)
- Accessible and responsive UI following **WCAG 2.1 AA** standards
- **Firebase Authentication** for secure login
- **Firestore** for structured data (materials, notes, quiz attempts, emotions)
- **Firebase Storage** for file uploads
- **Firebase Hosting** with custom domain: [www.tempolearn.org](http://www.tempolearn.org)
- **GitHub Actions** CI/CD pipeline for automated testing and deployment

---

## Tech Stack

**Frontend**
- React 18 with TypeScript  
- Vite (development and build tooling)  
- Material-UI (MUI) for accessible, consistent components  
- Recharts for data visualization  
- Framer Motion for animations  

**Backend**
- Node.js + Express API services  
- OpenAI API for notes, quizzes, and motivational messages  
- JSON schema validation for reliable AI outputs  

**Services**
- Firebase Authentication (secure user management)  
- Firestore (quiz attempts, notes, emotions, metadata)  
- Firebase Storage (PDF uploads)  
- Firebase Hosting (production deployment)  

---

## Testing and Validation

- **Core functional flows validated** (upload → notes → quiz → dashboard)  
- Prompt validation success rate: 82%  
- PDF parsing accuracy: 90% (scanned PDFs deferred to future OCR support)  
- Difficulty alignment: 80%  
- Accessibility compliance: 83–93% (measured via Lighthouse)  
- Average quiz generation response: 3.5 seconds  
- Authentication latency: 1.4 seconds  
- CI/CD pipeline reliability: 91.7%  

---

## Future Enhancements

- Optical Character Recognition (OCR) support for scanned PDFs and handwritten notes  
- Spaced Repetition Algorithms (SRA) to personalise quiz scheduling and review intervals  
- Emotion-aware scheduling to adjust quiz pacing by performance and mood (requires longitudinal data)  
- Cross-platform integration with mobile and desktop apps  
- Gamification features such as streaks and leaderboards  

---

## Project Structure
/frontend → React + Vite + TypeScript app
/backend → Express + OpenAI integration
/firebase → Config for Firestore, Auth, Storage
/utils → Shared utilities (PDF parsing, quiz-worthiness filter, validation)


---

## Getting Started

### Run Backend + Frontend
```bash
cd backend
npx ts-node-dev src/index.ts

cd frontend
npm run dev
Author

Luke Kenny
Developer of TempoLearn

