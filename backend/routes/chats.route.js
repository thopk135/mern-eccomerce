import { chatWithAi } from "../controllers/chats.controller.js";

import express from "express";

const router = express.Router();
router.post("/", chatWithAi);

export default router;