# Book Review Platform (MERN)

## Features
- User signup/login (JWT + bcrypt)
- CRUD for books
- Reviews with ratings (1-5)
- Pagination (5 books/page)
- Search & basic sort
- Protected routes (middleware)
- Frontend React app (pages: Signup, Login, Book List, Book Details, Add/Edit, Profile)

## Setup
### Backend
1. cd backend
2. npm install
3. copy .env.example -> .env and set MONGO_URI and JWT_SECRET
4. npm run dev

### Frontend
1. cd frontend
2. npm install
3. create .env with REACT_APP_API_BASE=http://localhost:5000/api (optional)
4. npm start
