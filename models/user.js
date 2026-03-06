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
    isverify: {
        type: Boolean,
        default: false
    },

    OTP: {
        type: String,
    },
    otpExpiresAt: {
        type: Date,
    },
    passwordToken: {
        type: Number,
        // required: true
    },
    tokenExpiresAt: {
        type: Date

    }







})

export const User = mongoose.model('User', userSchema);