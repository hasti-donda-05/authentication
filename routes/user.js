import express from "express";
import { Register, login, getdata, varifyOTP } from '../controllers/user.js';

const router = express.Router();

router.post('/register', Register);
router.get('/login', login)
router.get('/get', getdata)
router.get('/varifyOTP', varifyOTP)


export default router;