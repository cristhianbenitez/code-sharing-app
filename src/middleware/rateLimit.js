import rateLimit from 'express-rate-limit';
import { productionConfig } from '../config/production';

export const rateLimiter = rateLimit({
  windowMs: productionConfig.security.rateLimitDuration * 1000,
  max: productionConfig.security.rateLimitRequests,
  message: { error: 'Too many requests, please try again later.' }
}); 
