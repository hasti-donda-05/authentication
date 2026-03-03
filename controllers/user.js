import { User } from "../models/user.js";
import express from 'express';
const app = express();
// const Register = async (req, res) => {
//     try {
//         const user = await User.find()
//         res.status(200).json({
//             status: true,
//             data: user,
//             message: "get Successfully"
//         })

//     } catch (error) {
//         console.log(error);
//         res.status(500).json({
//             status: false,
//             message: "savdgh"
//         })
//     }
// }

const Register = async (req, res) => {
    try {
        req.body.OTP = Math.floor(Math.floor(Math.random() * (999999 - 100000)) + 100000);
        // req.body.passwordToken = Date.now()

        if (req.body.user_name != '' && req.body.email != '' && req.body.mobile != '' && req.body.password != '' && req.body.confirm_password != '' && req.body.name != '' && req.body.otp != '') {
            // console.log('hello');
            // res.status(500).json({
            // success: true,
            // message: "user sd,jbdfnmbgl exists..."
            // })
            if (req.body.password !== req.body.confirm_password) {
                // console.log('done');
                res.status(400).json({
                    status: false,
                    message: "password doesn't match"
                })
            }
            else {
                if (req.body.mobile.length < 10) {
                    res.status(400).json({
                        status: false,
                        message: "Enter valid mobile number"
                    })
                }
                else {
                    if (!req.body.OTP) {
                        res.status(400).json({
                            status: false,
                            message: "Please Enter OTP"
                        })
                    }
                    else {
                        if (req.body.isVarify == true) {
                            await User.create(req.body);
                            res.status(201).json({
                                success: true,
                                message: "User Registered successfully"
                            })
                        }
                        else {
                            res.status(400).json({
                                success: false,
                                message: "Please varify first"

                            })
                        }
                    }
                }


            }
        }
        else {
            res.status(400).json({
                success: false,
                message: "please fill alll the field..."
            })
        }




    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: false,
            message: "user already exists..."
        })
    }
}
const varifyOTP = async (req, res) => {
    try {
        if (!req.body.email || !req.body.OTP) {
            res.status(200).json({
                success: false,
                messge: "Please enter Your Email and OTP"
            })
        }
        else {
            // await console.log('asdcb');
            const user = await User.findOne({ email: req.body.email });
            if (req.body.OTP === user.OTP) {

                console.log(user);
                res.status(200).json({
                    success: true,
                    data: user,
                    messge: "OTP varified"
                })
            }
            else {
                res.status(400).json({
                    success: false,
                    messge: "please enter correct OTP"
                })
            }
        }
    } catch (error) {
        console.log(error.message);
    }
}
const login = async (req, res) => {
    try {
        if (!req.body.email || !req.body.password) {

            res.status(400).json({
                success: false,
                message: "User not found please enter both mobile password and email"
            })
        }
        else {
            // const user = await User.find({ $and: [{ email: req.body.email }, { password: req.body.password }] });
            const user = await User.find({ $and: [{ email: req.body.email }, { password: req.body.password }] });

            console.log(user);
            if (user.length !== 0) {
                res.status(200).json({
                    success: true,
                    data: user,
                    message: "User Found"
                })

            }
            else {
                res.status(404).json({
                    success: false,
                    message: "User not Found please enter valid email and password"
                })
            }
        }


        // else {
        //     const user = await User.create(req.body);
        //     res.status(200).json({
        //         success: true,
        //         data: user,
        //         message: "User Already exist"
        //     })
        // }

    } catch (error) {
        console.log(error);
        res.status(500).json({
            success: false,
            message: "savdgh"
        })
    }
}

const forgot_password = async (req, res) => {
    try {
        if (!req.body.email) {
            await res.status(500).json({
                status: false,
                message: "please enter your email address"
            })
        }
        else {
            const user = await User.findOne({ email: req.body.email });
            if (user) {
                user.passwordToken = await Date.now();
                await user.save()
                await user.save();
                res.status(200).json({
                    status: true,
                    data: user,
                    message: "User fount and reset token generated"
                })
            }
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: false,
            message: "error"
        })
    }
}




const getdata = async (req, res) => {
    const user = await User.find();
    res.status(200).json({
        data: user,
    })
}

export {
    Register, login, getdata, varifyOTP, forgot_password
};