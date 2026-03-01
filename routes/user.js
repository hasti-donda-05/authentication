import express from "express";
import { Register, login, getdata } from '../controllers/user.js';

const router = express.Router();

router.post('/register', Register);
router.get('/login', login)
router.get('/get',getdata)


export default router;