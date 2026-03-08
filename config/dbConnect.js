import env from 'dotenv';
env.config()

import mongoose from "mongoose";
console.log(process.env.MONGO_URL)
mongoose.connect(process.env.MONGO_URL).then(() => {
    console.log('Database Connected');
}).catch((err) => {
    console.log('error', err);
})
// hastidonda31_db_user
// Sg21AwacMCSTp6d1
// mongodb+srv://hastidonda31_db_user:Sg21AwacMCSTp6d1@cluster0.qovcc7h.mongodb.net/