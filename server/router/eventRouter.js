import express from 'express';
import { createEvent, getAllEvents, updateEventStatus, cancelEvent } from '../controllers/eventcontroller.js';
import { isAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/create', createEvent);
router.get('/', getAllEvents);
router.put('/status/:id', isAdmin, updateEventStatus);
router.put('/cancel/:id', cancelEvent);

export default router;