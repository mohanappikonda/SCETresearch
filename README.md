# SCET Research Profile Management Portal

A premium academic portfolio and research analytics platform designed for **Swarnandhra College of Engineering & Technology (Autonomous)**. This portal enables faculty members to manage their research profiles, track publications, patents, and projects, while providing administrators with real-time institutional analytics.

## 🚀 Key Features

- **Faculty Onboarding**: Seamless registration and login for institutional faculty.
- **Research Tracking**: Comprehensive modules for tracking:
  - Publications (Journals, Conferences, Book Chapters)
  - Research Projects (Ongoing and Completed)
  - Patents (Filed, Published, Granted)
  - NPTEL Certifications
  - Workshops (Organized and Attended)
- **Institutional Analytics**: Real-time dashboard with visualizations for:
  - Total research output metrics.
  - Department-wise distribution of faculty and publications.
  - Activity trends.
- **Premium UI/UX**: Modern, responsive design featuring glassmorphism, micro-animations, and institutional branding.

## 🛠️ Technology Stack

- **Frontend**: React (Vite), Bootstrap, Material UI, Recharts, Axios.
- **Backend**: Node.js, Express.js, Mongoose.
- **Database**: MongoDB (Community Edition).
- **Authentication**: JWT (JSON Web Tokens) with secure password hashing.

## 📥 Installation & Setup

### Prerequisites
- Node.js (v18+)
- MongoDB (Running on `localhost:27017`)

### Backend Setup
1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file based on the environment variables provided.
4. Seed the database with sample data:
   ```bash
   node seed.js
   ```
5. Start the server:
   ```bash
   npm run dev
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## 📊 Usage

- **Dashboard**: Access institutional research metrics at a glance.
- **Faculty Directory**: Search and filter faculty profiles by department or research interests.
- **Manage Profile**: Faculty can log in to update their professional details and research contributions.

## 🔒 Security

- Sensitive keys are managed via environment variables.
- Password security is ensured using `bcryptjs`.
- Protected routes require a valid JWT token.

---
© 2026 Swarnandhra College of Engineering & Technology (Autonomous). All Rights Reserved.
