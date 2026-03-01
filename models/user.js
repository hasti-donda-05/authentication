import mongoose from "mongoose";
const userSchema = mongoose.Schema({
    user_name: {
        type: String,

    },
    email: {
        type: String,

        unique: true
    },
    mobile: {
        type: String,

        unique: true
    },
    password: {
        type: String,

    },
    // confirm_password: {
    //     type: String,
    //  
    // },
    name: {

        type: String,
    },


})

export const User = mongoose.model('User', userSchema);