import { Router } from 'express';
import { chatWithGPT } from '../controllers/chatController';
import rateLimit from 'express-rate-limit';

const router = Router();

// Set up rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});

router.post('/', limiter, chatWithGPT);

export default router;
