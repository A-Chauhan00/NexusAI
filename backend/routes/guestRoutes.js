import express from "express";
import { sendGuestMessage } from "../controllers/guestController.js";

const router = express.Router();

router.post("/message", sendGuestMessage);

export default router;