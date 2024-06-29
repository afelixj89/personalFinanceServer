import { Router } from 'express';
import { chatWithGPT } from '../controllers/chatController'; // Ensure this path is correct

const router = Router();

router.post('/chat', chatWithGPT);

export default router;
