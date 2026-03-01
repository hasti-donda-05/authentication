import env from 'dotenv';
env.config()

import mongoose from "mongoose";
mongoose.connect(process.env.MONGO_URL).then(() => {
    console.log('Database Connected');
}).catch((err) => {
    console.log('error', err);
})
