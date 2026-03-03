import express from "express";
import { Register, login, getdata, varifyOTP, forgot_password } from '../controllers/user.js';

const router = express.Router();

router.post('/register', Register);
router.get('/login', login)
router.get('/get', getdata)
router.get('/varifyOTP', varifyOTP)
router.post('/forgot_password', forgot_password);


export default router;