import "dotenv/config";
// import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import chatRoutes from './routes/chatRoutes.js';
import authRoutes from "./routes/authRoutes.js";
import guestRoutes from "./routes/guestRoutes.js";
import cookieParser from "cookie-parser";

// dotenv.config();
const app =express();

app.use(cors({
    origin: process.env.CLIENT_URL,
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

app.get("/",(req,res)=>{
    res.send( "Nexus Ai backend");
})

app.use("/api/chats",chatRoutes);
app.use("/api/auth",authRoutes);
app.use("/api/guest", guestRoutes);


const PORT =process.env.PORT || 5000;
const startServer= async()=>{
    await connectDB();
    app.listen(PORT,()=>{
    console.log(`server started at ${PORT}`);
    })
}

startServer();



