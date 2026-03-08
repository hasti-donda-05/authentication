import env from 'dotenv';
env.config();
import './config/dbConnect.js';
import express from 'express';
import mongoose from 'mongoose';
import { Register, login, getdata } from './controllers/user.js';
import router from './routes/main.js';

const port = +process.env.PORT || 3500;

// const { MongoClient } = require("mongodb");

const app = express()
app.use(express.json())
app.use('/api', router)

// app.get('/api/user/get',getuser)
// app.get('/api/user/login',login)
// app.post('/api/user/create',Register)


app.listen(port, () => {
    console.log('server running');
})