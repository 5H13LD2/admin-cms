# TechLaunch CMS - Full Stack Course Management

This is a complete full-stack course management system built with React (Frontend) and Node.js/Express (Backend) with Firebase Firestore database.

## 📁 Project Structure

```
capstone-cms/
├── backend/                 # Node.js/Express Backend
│   ├── config/             # Firebase configuration
│   ├── controllers/        # Route controllers
│   ├── routes/            # API routes
│   ├── services/          # Business logic & Firestore operations
│   ├── middleware/        # Auth & validation middleware
│   ├── utils/             # Logger and utilities
│   └── server.js          # Express server entry point
│
├── src/                    # React Frontend
│   ├── pages/             # Page components
│   │   └── Courses.tsx    # Course management page
│   ├── services/          # API service layer
│   │   └── api.ts         # API client with TypeScript types
│   ├── styles/            # Reusable CSS
│   │   └── global.css     # Global styles for all pages
│   └── main.tsx           # React entry point
│
└── public/                 # Static assets
```

## 🚀 Features

### Backend (API)
- ✅ RESTful API with Express.js
- ✅ Firebase Firestore integration
- ✅ Course CRUD operations
- ✅ Module management
- ✅ Error handling & logging
- ✅ CORS & security middleware

### Frontend (React)
- ✅ Modern React with TypeScript
- ✅ Full CRUD operations for courses
- ✅ Search and filter functionality
- ✅ Responsive design
- ✅ Modal-based forms
- ✅ Real-time statistics
- ✅ Loading states & error handling
- ✅ Reusable CSS design system

## 🛠️ Setup Instructions

### Prerequisites
- Node.js 16+ installed
- Firebase project created
- Git installed

### 1. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env

# Edit .env file with your Firebase credentials
# Add your Firebase Admin SDK credentials

# Start the backend server
npm start
```

The backend will run on `http://localhost:5000`

### 2. Frontend Setup

```bash
# Navigate to project root
cd ..

# Install dependencies
npm install

# Configure environment variables
cp .env.example .env.local

# Edit .env.local and set:
# VITE_API_BASE_URL=http://localhost:5000/api

# Start the development server
npm run dev
```

The frontend will run on `http://localhost:5173` (or another port if 5173 is busy)

## 📡 API Endpoints

### Courses

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/courses` | Get all courses |
| GET | `/api/courses/:id` | Get course by ID |
| GET | `/api/courses/:id/modules` | Get course modules |
| POST | `/api/courses` | Create new course |
| PUT | `/api/courses/:id` | Update course |
| DELETE | `/api/courses/:id` | Delete course |

### Modules

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/modules` | Get all modules |
| GET | `/api/modules/:id` | Get module by ID |
| POST | `/api/modules` | Create new module |
| PUT | `/api/modules/:id` | Update module |
| DELETE | `/api/modules/:id` | Delete module |

## 🎨 Using the Reusable CSS

The global CSS file (`src/styles/global.css`) provides reusable styles for all pages:

### Import in your component:
```tsx
import '../styles/global.css';
```

### Available CSS Classes:

**Layout:**
- `.grid`, `.grid-cols-1`, `.grid-cols-2`, `.grid-cols-3`, `.grid-cols-4`
- `.flex`, `.items-center`, `.justify-between`, `.justify-center`
- `.gap-1`, `.gap-2`, `.gap-3`, `.gap-4`

**Cards:**
- `.card` - Base card component
- `.card-header` - Card header
- `.card-title` - Card title
- `.card-actions` - Action buttons container
- `.stats-card` - Statistics card

**Buttons:**
- `.btn-primary` - Primary button (gradient blue)
- `.btn-secondary` - Secondary button (gray)
- `.btn-danger` - Danger button (red)
- `.action-btn` - Icon action button

**Badges:**
- `.badge` - Base badge
- `.badge-success` - Green badge
- `.badge-warning` - Yellow badge
- `.badge-danger` - Red badge
- `.badge-primary` - Blue badge

**Forms:**
- `.form-group` - Form group container
- `.form-label` - Form label
- `.form-control` - Input/textarea
- `.form-select` - Select dropdown

**Modals:**
- `.modal-overlay` - Modal backdrop
- `.modal-content` - Modal container
- `.modal-header` - Modal header
- `.modal-body` - Modal body
- `.modal-footer` - Modal footer

**Alerts:**
- `.alert-success` - Success alert
- `.alert-error` - Error alert
- `.alert-warning` - Warning alert
- `.alert-info` - Info alert

**Utilities:**
- `.spinner` - Loading spinner
- `.spinner-overlay` - Full-screen loading overlay
- `.empty-state` - Empty state component
- `.page-title` - Page title
- `.text-center`, `.text-sm`, `.text-lg`
- `.font-semibold`, `.font-bold`
- `.mt-1` to `.mt-4`, `.mb-1` to `.mb-4`, `.p-1` to `.p-4`

## 📝 Code Examples

### Creating a New Page with Reusable Styles

```tsx
import { useState, useEffect } from 'react';
import '../styles/global.css';

export default function MyPage() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);

  return (
    <div className="p-4">
      {/* Header */}
      <h1 className="page-title">My Page</h1>

      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        <div className="stats-card">
          <i className="fas fa-chart-line stats-icon"></i>
          <div className="stats-content">
            <h3>125</h3>
            <p>Total Items</p>
          </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {data.map((item) => (
          <div key={item.id} className="card">
            <div className="card-header">
              <h3 className="card-title">{item.title}</h3>
              <div className="card-actions">
                <button className="action-btn edit">
                  <i className="fas fa-edit"></i>
                </button>
                <button className="action-btn delete">
                  <i className="fas fa-trash"></i>
                </button>
              </div>
            </div>
            <p>{item.description}</p>
          </div>
        ))}
      </div>

      {/* Loading */}
      {loading && (
        <div className="spinner-overlay">
          <div className="spinner"></div>
        </div>
      )}
    </div>
  );
}
```

### Using the API Service

```tsx
import { courseAPI, type Course } from '../services/api';

// Get all courses
const courses = await courseAPI.getAllCourses();
console.log(courses.data); // Array of courses

// Create a course
const newCourse = await courseAPI.createCourse({
  title: 'Advanced Python',
  description: 'Learn advanced Python concepts',
  difficulty: 'Advanced',
  language: 'Python',
  duration: 40
});

// Update a course
await courseAPI.updateCourse('course_id', {
  title: 'Updated Title'
});

// Delete a course
await courseAPI.deleteCourse('course_id');
```

## 🔧 Environment Variables

### Backend (.env)
```env
PORT=5000
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY=your-private-key
FIREBASE_CLIENT_EMAIL=your-client-email
```

### Frontend (.env.local)
```env
VITE_API_BASE_URL=http://localhost:5000/api
```

## 🗄️ Firestore Database Structure

```
courses (collection)
  ├── {courseId} (document)
      ├── id: string
      ├── title: string
      ├── description: string
      ├── difficulty: string (Beginner|Intermediate|Advanced)
      ├── language: string
      ├── duration: number
      ├── thumbnail: string | null
      ├── enrolledUsers: array
      ├── enrolledStudents: number
      ├── rating: number
      ├── status: string
      ├── createdAt: timestamp
      └── updatedAt: timestamp

modules (collection)
  ├── {moduleId} (document)
      ├── id: string
      ├── courseId: string
      ├── title: string
      ├── description: string
      ├── order: number
      ├── estimatedMinutes: number
      ├── totalLessons: number
      ├── isUnlocked: boolean
      ├── createdAt: timestamp
      └── updatedAt: timestamp
```

## 🚦 Testing the Full Stack

1. **Start Backend:**
   ```bash
   cd backend
   npm start
   ```

2. **Start Frontend:**
   ```bash
   npm run dev
   ```

3. **Test the API:**
   - Open browser to `http://localhost:5173`
   - Navigate to the Courses page
   - Try creating, editing, and deleting courses
   - View course modules

4. **Check Backend Logs:**
   - Backend logs are in `backend/logs/`
   - Console shows all API requests

## 📦 Building for Production

### Frontend
```bash
npm run build
```
Output will be in `dist/` folder

### Backend
```bash
cd backend
# Set NODE_ENV=production in .env
npm start
```

## 🎯 Next Steps

1. **Add Authentication:**
   - Implement user login/signup
   - Protect routes with auth middleware
   - Add role-based access control

2. **Extend Functionality:**
   - Create Modules page using the same pattern
   - Create Lessons page
   - Add Quiz management

3. **Improve UX:**
   - Add pagination for large datasets
   - Implement real-time updates
   - Add file upload for course thumbnails

4. **Deploy:**
   - Deploy backend to Render/Railway/Heroku
   - Deploy frontend to Vercel/Netlify
   - Update environment variables

## 🐛 Troubleshooting

### Backend won't start
- Check if port 5000 is already in use
- Verify Firebase credentials in .env
- Check `backend/logs/` for errors

### Frontend can't connect to backend
- Verify backend is running on port 5000
- Check CORS settings in backend
- Verify `VITE_API_BASE_URL` in .env.local

### Courses not loading
- Check browser console for errors
- Verify Firestore database has courses
- Check network tab in browser DevTools

## 📚 Resources

- [React Documentation](https://react.dev)
- [Express.js Documentation](https://expressjs.com)
- [Firebase Documentation](https://firebase.google.com/docs)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)

## 👥 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

MIT License - feel free to use this project for learning and development!
