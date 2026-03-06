import express from "express";
import { Register, login, getdata, verifyOTP, forgot_password, change_password,reset_password} from '../controllers/user.js';

const router = express.Router();

router.post('/register', Register);
router.get('/login', login)
router.get('/get', getdata)
router.get('/verifyOTP', verifyOTP)
router.post('/forgot_password', forgot_password);
router.post('/change_password', change_password);
router.post('/reset_password', reset_password);


export default router;