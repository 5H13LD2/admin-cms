# Capstone CMS - Complete Setup Guide

This guide will help you set up and run the complete Capstone CMS application with backend and frontend.

## Project Overview

This is a complete Course Management System (CMS) with:
- **Backend**: Express.js API with Firebase/Firestore database
- **Frontend**: React with Vite, TypeScript, and Shadcn UI
- **Authentication**: JWT-based authentication with role-based access control
- **Features**: Course management, modules, lessons, quizzes, enrollments, and dashboard

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Firebase account
- Git

## Quick Start

### 1. Firebase Setup

#### Step 1: Get Firebase Service Account Key

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project `capstone-27c33`
3. Click the gear icon (⚙️) > Project Settings
4. Go to "Service Accounts" tab
5. Click "Generate New Private Key"
6. Download the JSON file
7. Rename it to `serviceAccountKey.json`
8. Move it to `backend/config/serviceAccountKey.json`

**IMPORTANT**: Never commit this file to Git. It's already in `.gitignore`

#### Step 2: Enable Firestore Database

1. In Firebase Console, go to "Firestore Database"
2. Click "Create database"
3. Choose "Start in production mode" or "Test mode"
4. Select your preferred location
5. Click "Enable"

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies (already done)
npm install

# Start the development server
npm run dev
```

The backend will start on `http://localhost:5000`

**Verify it's working**: Open `http://localhost:5000/health` in your browser

### 3. Frontend Setup

```bash
# Navigate back to root directory
cd ..

# Install dependencies (already done)
npm install

# Start the development server
npm run dev
```

The frontend will start on `http://localhost:5173`

## Project Structure

```
capstone-cms/
├── backend/
│   ├── config/
│   │   ├── firebase-admin.js           # Firebase admin SDK initialization
│   │   ├── firebase-config.js          # Firebase client config
│   │   ├── google-services.json        # Firebase Android config
│   │   └── serviceAccountKey.json      # ⚠️ REQUIRED - Download from Firebase
│   ├── controllers/                    # Request handlers
│   │   ├── authController.js
│   │   ├── courseController.js
│   │   ├── dashboardController.js
│   │   ├── enrollController.js
│   │   ├── lessonController.js
│   │   ├── moduleController.js
│   │   ├── quizController.js
│   │   └── userController.js
│   ├── middleware/                     # Authentication & validation
│   │   ├── authMiddleware.js
│   │   └── validateRequest.js
│   ├── routes/                         # API routes
│   │   ├── authRoutes.js
│   │   ├── courseRoutes.js
│   │   ├── dashboardRoutes.js
│   │   ├── enrollmentRoutes.js
│   │   ├── lessonRoutes.js
│   │   ├── moduleRoutes.js
│   │   ├── quizzesRoutes.js
│   │   └── userRoutes.js
│   ├── services/                       # Business logic
│   │   └── firestore/                  # Firestore operations
│   │       ├── courseService.js
│   │       ├── dashboardService.js
│   │       ├── enrollmentService.js
│   │       ├── lessonService.js
│   │       ├── moduleService.js
│   │       ├── quizService.js
│   │       └── userService.js
│   ├── utils/
│   │   └── logger.js                   # Winston logger
│   ├── logs/                           # Auto-generated logs
│   ├── .env                            # Environment variables
│   ├── .env.example                    # Example env file
│   ├── package.json
│   └── server.js                       # Express app entry point
│
├── src/                                # Frontend React app
│   ├── components/
│   ├── pages/
│   ├── hooks/
│   └── lib/
│
├── package.json                        # Frontend dependencies
└── README.md
```

## Environment Variables

### Backend (.env)

Located at `backend/.env` - Already configured with defaults:

```env
PORT=5000
NODE_ENV=development
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-capstone-cms-2024
JWT_EXPIRES_IN=7d
FIREBASE_PROJECT_ID=capstone-27c33
FIREBASE_SERVICE_ACCOUNT_PATH=./config/serviceAccountKey.json
CORS_ORIGIN=http://localhost:5173
LOG_LEVEL=info
```

**For Production**: Change `JWT_SECRET` to a secure random string!

## API Documentation

### Base URL
- Development: `http://localhost:5000/api`

### Authentication Endpoints

#### Register
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "student@example.com",
  "password": "password123",
  "name": "John Doe",
  "role": "student"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "student@example.com",
  "password": "password123"
}
```

Response:
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "user123",
      "email": "student@example.com",
      "name": "John Doe",
      "role": "student"
    }
  }
}
```

### Protected Endpoints

All other endpoints require the JWT token in the Authorization header:

```http
Authorization: Bearer <your-jwt-token>
```

### User Roles

- **admin**: Full system access
- **instructor**: Can create/manage courses, modules, lessons, quizzes
- **student**: Can enroll in courses, view content, submit quizzes

## Testing the Backend

### Using cURL

```bash
# Register a new user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"pass123","name":"Test User","role":"student"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"pass123"}'

# Get all courses (no auth required)
curl http://localhost:5000/api/courses

# Get dashboard stats (requires auth)
curl http://localhost:5000/api/dashboard/stats \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

### Using Postman or Insomnia

1. Import the API endpoints from the backend README
2. Create an environment variable for the base URL
3. Test authentication flow
4. Use the returned token for protected routes

## Running Both Servers

### Terminal 1 - Backend
```bash
cd backend
npm run dev
```

### Terminal 2 - Frontend
```bash
# From root directory
npm run dev
```

## Common Issues and Solutions

### Issue: Firebase initialization error

**Solution**:
1. Make sure `serviceAccountKey.json` exists in `backend/config/`
2. Verify the file has valid JSON format
3. Check Firebase project ID matches in the file

### Issue: Port already in use

**Solution**:
- Backend: Change `PORT` in `backend/.env`
- Frontend: Vite will prompt you to use a different port

### Issue: CORS errors

**Solution**:
Update `CORS_ORIGIN` in `backend/.env` to match your frontend URL

### Issue: Module not found errors

**Solution**:
```bash
# Reinstall backend dependencies
cd backend
rm -rf node_modules package-lock.json
npm install

# Reinstall frontend dependencies
cd ..
rm -rf node_modules package-lock.json
npm install
```

## Development Workflow

1. Start the backend server
2. Start the frontend development server
3. Backend runs on port 5000
4. Frontend runs on port 5173
5. Frontend makes API calls to `http://localhost:5000/api`

## Building for Production

### Backend
```bash
cd backend
npm start
```

### Frontend
```bash
npm run build
npm run preview
```

## Database Structure (Firestore)

The application uses these Firestore collections:

- **users**: User accounts and profiles
- **courses**: Course information
- **modules**: Course modules (ordered content sections)
- **lessons**: Individual lessons within modules
- **quizzes**: Quiz questions and answers
- **quiz_submissions**: Student quiz submissions
- **enrollments**: Course enrollments with progress tracking

## Security Best Practices

1. **Never commit** `serviceAccountKey.json` to Git
2. **Change** the default JWT_SECRET in production
3. **Enable** Firestore security rules in Firebase Console
4. **Use** environment variables for sensitive data
5. **Enable** HTTPS in production

## Next Steps

1. ✅ Backend is fully set up and configured
2. ✅ All dependencies are installed
3. ⚠️ **Download Firebase service account key** (required!)
4. 🚀 Start both servers and begin development
5. 🎨 Customize the frontend to match your design
6. 📝 Add Firestore security rules
7. 🚢 Deploy to production

## Support

For issues or questions:
1. Check the backend README: `backend/README.md`
2. Review Firebase documentation
3. Check server logs in `backend/logs/`

## License

ISC
