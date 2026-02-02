import express from 'express';
import { createNotification, getNotifications } from '../controllers/notificationcontroller.js';

const router = express.Router();

router.post('/create', createNotification);
router.get('/:toUser', getNotifications);

export default router;