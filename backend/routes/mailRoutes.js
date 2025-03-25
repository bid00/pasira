import express from 'express';
import { subscribeUser,contactForm,callBack } from '../controllers/mailController.js';

const router = express.Router();

router.post('/subscribe', subscribeUser);
router.post('/contact',contactForm);
router.post('/callback',callBack); 

export default router;
