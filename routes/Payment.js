import express  from "express";

import { Subscription, SubscriptionFree, Webhook } from "../controllers/Subscription.js"

const router = express.Router();

router.post('/payment/:id', Subscription)
router.post('/Free', SubscriptionFree)
router.post('/webhook', Webhook)

export default router