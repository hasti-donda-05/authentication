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
        // req.body.passwordToken = Date.now()
        req.body.OTP = Math.floor(Math.random() * 999999 - 100000) + 100000;
        req.body.otpExpiresAt = Date.now() + 1 * 60 * 1000;

        if (!req.body.user_name || !req.body.email || !req.body.mobile || !req.body.password || !req.body.confirm_password || !req.body.name || !req.body.OTP) {

            return res.status(400).json({
                success: false,
                message: "please fill alll the field..."
            })



        }
        else {
            if (req.body.password !== req.body.confirm_password) {
                return res.status(400).json({
                    status: false,
                    message: "password doesn't match"
                })
            }
            else {


                const user = await User.create(req.body);
                // await user.save();   
                return res.status(201).json({
                    success: true,

                    message: "User Registered successfully"
                });


            }
        }




    } catch (error) {
        console.log(error.errors);
        res.status(500).json({
            status: false,
            message: error.message
        });
    }
}
const varifyOTP = async (req, res) => {
    try {
        if (!req.body.email || !req.body.OTP) {
            return res.status(200).json({
                success: false,
                messge: "Please enter Your Email and OTP"
            })
        }
        else {
            const user = await User.findOne({ email: req.body.email });
            console.log(user);

            console.log("Now:", Date.now());
            console.log("Expires:", user.tokenExpiresAt);
            if (!user) {
                return res.status(404).json({
                    success: false,

                    message: "user not found"
                });
            }

            if (req.body.OTP != user.OTP) {
                {

                    return res.status(200).json({
                        success: true,

                        message: "Invalid OTP"
                    });
                }
            }

            if (Date.now() > new Date(user.otpExpiresAt).getTime()) {
                user.OTP = null;
                user.otpExpiresAt = null;
                user.passwordToken = null;
                user.tokenExpiresAt = null;
                await user.save();
                return res.status(400).json({
                    success: false,
                    message: "OTP Expired"
                });
            }


            user.isVarify = true;
            await user.save();

            return res.status(200).json({
                success: true,
                message: "OTP Verified Successfully"
            });



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
                if (isVarify == true) {
                    res.status(200).json({
                        success: true,
                        data: user,
                        message: "User Found"
                    })
                }

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

            await user.save()
            if (!user) {


                res.status(200).json({
                    status: true,
                    data: user,
                    message: "User not  found"
                })
            }
            user.passwordToken = Math.floor(100000 + Math.random() * 900000);
            user.tokenExpiresAt = Date.now() + 1 * 60 * 1000;

            await user.save();


            res.status(200).json({
                status: true,
                message: "Reset OTP generated successfully"
            });


        }


    } catch (error) {
        console.log(error);
        res.status(500).json({
            status: false,
            message: "error"
        })
    }
}

const reset_password = async (req, res) => {
    console.log("hello")
    try {
        if (!req.body.email || !req.body.confirm_password || !req.body.new_password) {
            res.status(404).json({
                success: false,
                message: "PLease Fill All Details"
            })
        }
        else {
            const user = User.findOne({ email: req.body.email });
            if (user) {
                if (req.body.new_password === req.body.confirm_password) {
                    const cp = await User.findOneAndUpdate({ email: req.body.email }, { $set: { password: req.body.new_password } });
                    console.log(cp);

                    res.status(200).json({
                        success: true,
                        message: "Done"
                    })
                }
            }
            else {
                res.status(404).json({
                    success: true,
                    message: "User not found"
                })
            }
        }

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

const change_password = async (req, res) => {
    try {
        if (!req.body.email || !req.body.password) {
            res.status(400).json({
                success: false,
                message: "please enter email and password"
            })
        }
        else {

            const user = await User.find({ $and: [{ email: req.body.email }, { password: req.body.password }] });
            console.log(user);

            if (user) {
                const cp = await User.findOneAndUpdate({ password: req.body.password }, { $set: { password: req.body.new_password } }, { new: true });
                // req.body.password = req.body.new_password
                console.log(cp)
                res.status(400).json({
                    success: true,
                    data: user,
                    message: "please enter email and password"
                })
            }
        }

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
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
    Register, login, getdata, varifyOTP, forgot_password, change_password, reset_password
};