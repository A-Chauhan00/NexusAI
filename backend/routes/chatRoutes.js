import express from 'express';
import { createChat,getChat,getChats,deleteChat, sendMessage,renameChat } from '../controllers/chatController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router=express.Router();

router.post("/",authMiddleware,createChat);

router.get("/",authMiddleware,getChats);

router.get("/:id",authMiddleware,getChat);

router.delete("/:id",authMiddleware,deleteChat);

router.post("/:id/messages",authMiddleware,sendMessage);

router.put("/:id",authMiddleware, renameChat);

export default router;