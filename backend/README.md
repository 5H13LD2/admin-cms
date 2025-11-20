# Capstone CMS Backend

Backend API for the Capstone CMS built with Express.js and Firebase/Firestore.

## Features

- RESTful API with Express.js
- Firebase Firestore for database
- JWT authentication
- Role-based access control (Admin, Instructor, Student)
- Comprehensive course management
- Module and lesson organization
- Quiz system with submissions
- Enrollment tracking with progress
- Dashboard analytics

## Project Structure

```
backend/
├── config/              # Firebase and app configuration
├── controllers/         # Route controllers
├── middleware/          # Authentication and validation
├── routes/              # API routes
├── services/            # Business logic and Firestore operations
├── utils/               # Utility functions (logger)
├── logs/                # Application logs
├── .env                 # Environment variables
└── server.js            # Express app entry point
```

## Setup Instructions

### 1. Firebase Configuration

You need to obtain a Firebase service account key:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project (capstone-27c33)
3. Go to Project Settings > Service Accounts
4. Click "Generate New Private Key"
5. Save the downloaded JSON file as `backend/config/serviceAccountKey.json`

### 2. Environment Variables

The `.env` file has been created with default values. Update if needed:

```env
PORT=5000
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production-capstone-cms-2024
FIREBASE_SERVICE_ACCOUNT_PATH=./config/serviceAccountKey.json
```

### 3. Install Dependencies

Dependencies are already installed. If you need to reinstall:

```bash
cd backend
npm install
```

### 4. Start the Server

```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:5000`

## API Endpoints

### Authentication (`/api/auth`)
- `POST /login` - User login
- `POST /register` - User registration
- `POST /logout` - User logout (requires auth)
- `GET /verify` - Verify JWT token (requires auth)

### Users (`/api/users`)
- `GET /` - Get all users (admin only)
- `GET /profile` - Get current user profile
- `GET /:id` - Get user by ID
- `PUT /:id` - Update user
- `DELETE /:id` - Delete user (admin only)

### Courses (`/api/courses`)
- `GET /` - Get all courses
- `GET /:id` - Get course by ID
- `GET /my/courses` - Get instructor's courses
- `POST /` - Create course (instructor/admin)
- `PUT /:id` - Update course (instructor/admin)
- `DELETE /:id` - Delete course (instructor/admin)

### Modules (`/api/modules`)
- `GET /course/:courseId` - Get modules by course
- `GET /:id` - Get module by ID
- `POST /` - Create module (instructor/admin)
- `PUT /:id` - Update module (instructor/admin)
- `DELETE /:id` - Delete module (instructor/admin)

### Lessons (`/api/lessons`)
- `GET /module/:moduleId` - Get lessons by module
- `GET /:id` - Get lesson by ID
- `POST /` - Create lesson (instructor/admin)
- `PUT /:id` - Update lesson (instructor/admin)
- `DELETE /:id` - Delete lesson (instructor/admin)

### Quizzes (`/api/quizzes`)
- `GET /lesson/:lessonId` - Get quizzes by lesson
- `GET /:id` - Get quiz by ID
- `POST /:id/submit` - Submit quiz answers
- `GET /submissions/my` - Get user's quiz submissions
- `POST /` - Create quiz (instructor/admin)
- `PUT /:id` - Update quiz (instructor/admin)
- `DELETE /:id` - Delete quiz (instructor/admin)

### Enrollments (`/api/enrollments`)
- `GET /my` - Get user's enrollments
- `GET /` - Get all enrollments (admin/instructor)
- `GET /:id` - Get enrollment by ID
- `POST /` - Create enrollment (enroll in course)
- `PUT /:id/progress` - Update progress
- `DELETE /:id` - Delete enrollment (unenroll)

### Dashboard (`/api/dashboard`)
- `GET /stats` - Get dashboard statistics
- `GET /activities` - Get recent activities

## User Roles

- **admin**: Full access to all features
- **instructor**: Can create and manage courses, modules, lessons, and quizzes
- **student**: Can enroll in courses, view content, and submit quizzes

## Security Features

- Helmet.js for security headers
- CORS configuration
- Rate limiting (100 requests per 15 minutes)
- JWT token authentication
- Role-based access control
- Password hashing with bcrypt

## Logging

Logs are stored in the `logs/` directory:
- `combined.log` - All logs
- `error.log` - Error logs only

## Health Check

Check if the server is running:
```
GET http://localhost:5000/health
```

## Testing the API

You can test the API using tools like:
- Postman
- Insomnia
- cURL
- Thunder Client (VS Code extension)

### Example: Register a new user

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "student@example.com",
    "password": "password123",
    "name": "John Doe",
    "role": "student"
  }'
```

### Example: Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "student@example.com",
    "password": "password123"
  }'
```

## Firestore Collections

The backend uses the following Firestore collections:

- `users` - User accounts
- `courses` - Course information
- `modules` - Course modules
- `lessons` - Module lessons
- `quizzes` - Quiz questions and answers
- `quiz_submissions` - Student quiz submissions
- `enrollments` - Course enrollments

## Troubleshooting

### Firebase initialization error
Make sure you have:
1. Downloaded the service account key from Firebase Console
2. Placed it at `backend/config/serviceAccountKey.json`
3. The file has proper JSON format

### Port already in use
Change the PORT in `.env` file to a different value.

### CORS errors
Update `CORS_ORIGIN` in `.env` to match your frontend URL.

## Next Steps

1. Download your Firebase service account key
2. Place it in `backend/config/serviceAccountKey.json`
3. Start the backend server with `npm run dev`
4. Test the API endpoints
5. Integrate with your frontend

## License

ISC
