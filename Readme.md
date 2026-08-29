# NexusAI

NexusAI is a full-stack AI chatbot application built using MERN stack and powered by the Google Gemini API.

🔗 **Live Demo:** https://nexus-ai-chats.vercel.app/

---

## ✨ Features

- AI-powered conversations using Google Gemini
- User authentication with JWT and HTTP-only cookies
- Guest mode with limited prompts
- Persistent chat history
- Automatic chat titles
- Rename and delete conversations
- Markdown and code block rendering
- Syntax highlighting
- Password validation 
- Responsive desktop and mobile design
- Protection against duplicate message submissions

---

## 🛠️ Tech Stack

### Frontend
- React
- React Router
- React Markdown
- Axios


### Backend
- Node.js
- Express.js
- MongoDB
- Mongoose

### Other Technologies
- Google Gemini API
- bcryptjs


---

## 📸 Screenshots

### Homepage & Authentication
![NexusAI Homepage](<div align="center">
  <img src="frontend\public\assets\NexusAI_Desktop_HOMEPAGE.png" alt="Chat Interface" width="700" />
</div>) 
![NexusAI Login](<div align="center">
  <img src="frontend\public\assets\NexusAI_Login.png" alt="Chat Interface" width="700" />
</div>) 

### Real-Time Chat Interface
![NexusAI Chat Interface](<div align="center">
  <img src="frontend\public\assets\NexusAI_Chat_Interface.png" alt="Chat Interface" width="700" />
</div>) 

### Ui on Mobile
![Mobile Chat Interface](<div align="center">
  <img src="frontend\public\assets\NexusAI_Chat_Mobile_Chat_interface.png" alt="Mobile Chat Interface" width="300" />
</div>) 
![Mobile Chat Sidebar](
    <div align="center">
  <img src="frontend\public\assets\NexusAI_Mobile_Sidebar.png" alt="Mobile Chat Interface" width="300" />
</div>
) 

---

## 🧠 Key Concepts Implemented

- RESTful API design
- JWT authentication
- Protected routes
- HTTP-only cookie authentication
- MongoDB data modeling
- Google Gemini AI API integration
- Global state management using React Context
- Guest user functionality
- Responsive UI design

---
## 💡 Key Technical Challenges & Solutions

### 1. Duplicate Message & Race Conditions
- **Problem:** Fast clicks or double submits would send parallel requests to the Gemini API, causing wasted API usage.
- **Solution:** Implemented request-locking flags and state debouncing on the client side alongside prompt verification middleware on the backend to guarantee single-execution prompt cycles.

### 2. Implementing Guest mode 
- **Problem:** Allowing guest user's to send messages before logging in without changing the core authentication workflow.
- **Solution:** Structured an anonymous session workflow giving guests limited trials before requiring account registration to persist history.

### 3. Cors Block on deployed api request
- **Problem:** During production deployment, the frontend application hosted on Vercel was blocked from making API calls to the backend due to browser CORS policies. 
- **Solution:** implemented a Vercel Proxy Route Rewrite which requests directly to the backend server eliminating cross-origin errors completely.

---

## 🚀 Deployment

- Frontend and Backend: Vercel
- Database: MongoDB Atlas 

---

## 👨‍💻 Author

**Aman Chauhan**