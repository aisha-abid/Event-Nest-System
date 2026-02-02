import express from 'express';
import { requestModification, respondModification } from '../controllers/modificationcontroller.js';
import { isAdmin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/request', requestModification);
router.put('/respond/:id', isAdmin, respondModification);

export default router;
