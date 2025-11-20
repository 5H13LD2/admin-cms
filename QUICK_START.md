# 🚀 Quick Start Guide

## ⚠️ CRITICAL FIRST STEP

**You MUST download the Firebase service account key before the backend will work!**

### Get Firebase Service Account Key

1. Go to https://console.firebase.google.com/
2. Select project: **capstone-27c33**
3. Click ⚙️ (Settings) > Project Settings
4. Go to "Service Accounts" tab
5. Click "Generate New Private Key"
6. Download the JSON file
7. Save as: `backend/config/serviceAccountKey.json`

## 🏃 Running the Application

### Start Backend (Terminal 1)
```bash
cd backend
npm run dev
```
Backend runs on: http://localhost:5000

### Start Frontend (Terminal 2)
```bash
npm run dev
```
Frontend runs on: http://localhost:5173

## 🧪 Quick Test

### Check Backend Health
Open in browser: http://localhost:5000/health

### Create First User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@test.com",
    "password": "admin123",
    "name": "Admin User",
    "role": "admin"
  }'
```

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@test.com",
    "password": "admin123"
  }'
```

## 📁 File Structure

```
backend/
├── config/              ← Firebase config & service key
├── controllers/         ← API logic
├── middleware/          ← Auth & validation
├── routes/             ← API endpoints
├── services/           ← Database operations
├── utils/              ← Helper functions
└── server.js           ← Main entry point

src/                    ← Frontend (React)
```

## 🔑 API Endpoints

- `POST /api/auth/register` - Register
- `POST /api/auth/login` - Login
- `GET /api/courses` - List courses
- `GET /api/dashboard/stats` - Dashboard (auth required)
- `POST /api/enrollments` - Enroll in course (auth required)

Full API docs: See `backend/README.md`

## 👥 User Roles

- **admin** - Full access
- **instructor** - Create/manage courses
- **student** - Enroll & learn

## 🔧 Environment Files

All configured! Check these files if you need to change settings:
- `backend/.env` - Backend config
- Frontend config in `vite.config.ts`

## ❓ Troubleshooting

### Backend won't start
- Check if `serviceAccountKey.json` exists
- Verify port 5000 is available

### Frontend can't connect to backend
- Make sure backend is running on port 5000
- Check CORS settings in `backend/.env`

### Firestore errors
- Enable Firestore in Firebase Console
- Check service account key is valid

## 📚 Documentation

- Full setup: `SETUP_GUIDE.md`
- Backend API: `backend/README.md`
- Project structure: Your folder layout above

## ✅ Checklist

- [ ] Downloaded Firebase service account key
- [ ] Placed it at `backend/config/serviceAccountKey.json`
- [ ] Enabled Firestore in Firebase Console
- [ ] Started backend server
- [ ] Started frontend server
- [ ] Created first test user
- [ ] Tested login

---

**Ready to build?** Check `SETUP_GUIDE.md` for detailed information!
