import express  from "express";

import { askBot, verify } from "../controllers/askBot.js"

const router = express.Router();

router.post('/ask', askBot)
router.post('/verify', verify)

export default router