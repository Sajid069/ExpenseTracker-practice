 # 💰 Expense Tracker - Full Stack Application

A modern, full-stack expense tracking application built with React, Node.js, Express, and Firebase.

## ✨ Features

- 🔐 **User Authentication** - Secure login and registration
- 💸 **Expense Management** - Add, edit, and delete expenses
- 📊 **Real-time Dashboard** - View total expenses and statistics
- 📱 **Responsive Design** - Works on desktop and mobile
- 🎨 **Modern UI** - Clean interface with Shadcn UI components

## 🛠️ Tech Stack

**Frontend:**
- React 18
- Vite
- Tailwind CSS
- Shadcn UI
- Firebase Auth

**Backend:**
- Node.js
- Express.js
- Firebase Admin SDK
- Firestore Database

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- Firebase account
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/expense-tracker-fullstack.git
   cd expense-tracker-fullstack
cd backend
npm install
# Add your Firebase service account key as firebase-service-account.json
# Create .env file with your Firebase project ID
npm run dev
cd frontend
npm install
npm run dev

expense-tracker-fullstack/
├── backend/
│   ├── routes/
│   ├── services/
│   ├── index.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── context/
│   │   ├── services/
│   │   └── App.jsx
│   └── package.json
└── README.md